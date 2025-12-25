import os
import json
import argparse
import numpy as np
import pandas as pd
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import IncrementalPCA

def read_words(csv_path: str) -> list[str]:
    df = pd.read_csv(csv_path)
    if df.shape[1] == 1:
        words = df.iloc[:, 0].astype(str).tolist()
    else:
        col = "Lemma" if "Lemma" in df.columns else df.columns[0]
        words = df[col].astype(str).tolist()

    clean = []
    seen = set()
    for w in words:
        w = w.strip().lower()
        if not w:
            continue
        if w in seen:
            continue
        seen.add(w)
        clean.append(w)
    return clean

def l2_normalize(x: np.ndarray, eps: float = 1e-12) -> np.ndarray:
    n = np.linalg.norm(x, axis=1, keepdims=True)
    return x / np.maximum(n, eps)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="path to lemmas_top30k.csv")
    ap.add_argument("--out_dir", required=True, help="output dir, for example ../../public/ambient")
    ap.add_argument("--model", default="ai-forever/sbert_large_nlu_ru", help="SentenceTransformer model name")
    ap.add_argument("--batch", type=int, default=256)
    ap.add_argument("--pca_dim", type=int, default=384)
    args = ap.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)

    words = read_words(args.csv)
    print(f"words: {len(words)}")

    device = "cuda" if os.environ.get("CUDA_VISIBLE_DEVICES") not in (None, "", "-1") else "cpu"
    model = SentenceTransformer(args.model, device=device)

    emb_list = []
    for i in tqdm(range(0, len(words), args.batch), desc="encode"):
        batch_words = words[i:i+args.batch]
        vecs = model.encode(
            batch_words,
            batch_size=len(batch_words),
            convert_to_numpy=True,
            normalize_embeddings=False,
            show_progress_bar=False,
        )
        emb_list.append(vecs.astype(np.float32))

    X = np.vstack(emb_list)
    X = l2_normalize(X)

    orig_dim = X.shape[1]
    pca_dim = min(args.pca_dim, orig_dim)

    if pca_dim < orig_dim:
        ipca = IncrementalPCA(n_components=pca_dim, batch_size=4096)
        for i in tqdm(range(0, X.shape[0], 4096), desc="pca_fit"):
            ipca.partial_fit(X[i:i+4096])
        Xp = []
        for i in tqdm(range(0, X.shape[0], 4096), desc="pca_transform"):
            Xp.append(ipca.transform(X[i:i+4096]).astype(np.float32))
        X = np.vstack(Xp)
        X = l2_normalize(X)

        pca_path = os.path.join(args.out_dir, "pca_components.npy")
        np.save(pca_path, ipca.components_.astype(np.float32))

    words_path = os.path.join(args.out_dir, "words.json")
    with open(words_path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False)

    vecs_f16_path = os.path.join(args.out_dir, "vectors.f16")
    X16 = X.astype(np.float16)
    X16.tofile(vecs_f16_path)

    meta = {
        "count": int(len(words)),
        "dim": int(X16.shape[1]),
        "dtype": "float16",
        "model": args.model,
        "pca_dim": int(pca_dim),
    }
    meta_path = os.path.join(args.out_dir, "meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print("done")
    print(words_path)
    print(vecs_f16_path)
    print(meta_path)

if __name__ == "__main__":
    main()
