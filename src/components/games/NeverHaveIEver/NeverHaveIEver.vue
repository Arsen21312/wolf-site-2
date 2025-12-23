<template>
  <section class="nhi-shell" :class="{ 'nhi-play': started }">
    <div class="nhi-content">
      <div v-if="!started" class="nhi-hero">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <h1>Я никогда не</h1>
        <p class="nhi-sub">
Хочешь живую и смешную движуху для компании? Загляни в нашу онлайн-версию игры «Я никогда не» и устрой вечер, который точно запомнится.        </p>
        <button class="nhi-cta" @click="startGame">
          <span class="nhi-cta-icon">▶</span>
          Играть онлайн
        </button>
      </div>

      <div v-else class="nhi-game">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <div class="nhi-filters">
          <button
            v-for="c in categories"
            :key="c.id"
            class="nhi-chip"
            :class="{ 'nhi-chip-active': activeCategory === c.id }"
            @click="() => setCategory(c.id)"
          >
            <span class="nhi-chip-icon">{{ c.icon }}</span>
            {{ c.label }}
          </button>
        </div>
        <div class="nhi-filters-mobile">
          <button class="nhi-chip nhi-chip-primary" type="button" @click="toggleFilters">
            {{ selectedCategoryLabel }}
          </button>
          <div class="nhi-filters-extra" :class="{ open: showFilters }">
            <button
              v-for="c in mobileCategories"
              :key="c.id"
              class="nhi-chip"
              type="button"
              :class="{ 'nhi-chip-active': activeCategory === c.id }"
              @click="handleCategorySelect(c.id)"
            >
              <span v-if="c.icon" class="nhi-chip-icon">{{ c.icon }}</span>
              {{ c.label }}
            </button>
          </div>
        </div>

        <div class="nhi-card">
          <div class="nhi-label">{{ currentLabel }}</div>
          <div class="nhi-phrase">
            <p v-if="!currentPhrase">Правда или действие</p>
            <p v-else>{{ currentPhrase }}</p>
          </div>
        </div>

        <button class="nhi-next" @click="nextPhrase">Дальше</button>
      </div>
    </div>

    <SocialPopup :visible="showPopup" :payload="popupPayload" @close="handlePopupClose" />
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import { computed, ref } from 'vue';
import SocialPopup from '@/components/ui/SocialPopup.vue';

const categories = [
  { id: 'popular', label: 'Популярное', icon: '🥤' },
  { id: 'extreme', label: 'Экстрим', icon: '🔥' },
  { id: 'family', label: 'Для пар', icon: '💜' },
  { id: 'nsfw', label: 'Пошлое', icon: '🔞' }
];

const phrases = [
  { text: 'Я никогда не садился(ась) в машину к почти незнакомому человеку, хотя видео с этим пересматривал(а) сотни раз', category: 'extreme' },
  { text: 'Я никогда не соглашался(ась) на прогулку, хотя не помнил(а) имя человека', category: 'nsfw' },
  { text: 'Я никогда не терял(а) деньги просто из-за невнимательности, хотя иногда очень хотелось', category: 'popular' },
  { text: 'Я никогда не участвовал(а) в снежной битве до полного выматывания, даже на спор', category: 'extreme' },
  { text: 'Я никогда не спорил(а) с навигатором и проигрывал(а)', category: 'popular' },
  { text: 'Я никогда не проводил(а) выходные полностью в пижаме, хотя иногда очень хотелось', category: 'popular' },
  { text: 'Я никогда не целовался(ась) с кем-то сразу на первой встрече, хотя переписка заходила очень далеко', category: 'nsfw' },
  { text: 'Я никогда не участвовал(а) в рискованном челлендже, даже на спор', category: 'extreme' },
  { text: 'Я никогда не отправлял(а) пикантные сообщения, хотя мысль об этом мелькала', category: 'nsfw' },
  { text: 'Я никогда не делал(а) семейный альбом или архив фото, хотя знал(а), что это могло бы нас сблизить', category: 'family' },
  { text: 'Я никогда не ел(а) очень острую еду на спор', category: 'extreme' },
  { text: 'Я никогда не покупал(а) одинаковые подарки всем родственникам', category: 'family' },
  { text: 'Я никогда не проводил(а) новогоднюю ночь только в кругу семьи', category: 'family' },
  { text: 'Я никогда не уходил(а) с вечеринки, не попрощавшись ни с кем, хотя иногда очень хотелось', category: 'popular' },
  { text: 'Я никогда не погружался(ась) с аквалангом на большую глубину', category: 'extreme' },
  { text: 'Я никогда не проводил(а) выходные без друзей, только с семьёй', category: 'family' },
  { text: 'Я никогда не поднимался(ась) на сцену перед большой публикой без подготовки, даже ради ярких впечатлений', category: 'extreme' },
  { text: 'Я никогда не проверял(а) сообщения партнёра без разрешения', category: 'nsfw' },
  { text: 'Я никогда не сидел(а) за рулём больше десяти часов подряд', category: 'extreme' },
  { text: 'Я никогда не проводил(а) целый день без телефона с любимым человеком', category: 'family' },
  { text: 'Я никогда не ел(а) целый день только фастфуд', category: 'popular' },
  { text: 'Я никогда не отправлялся(ась) в поход с минимальными вещами, хотя в глубине души этого хочу', category: 'extreme' },
  { text: 'Я никогда не выходил(а) из дома в разных носках', category: 'popular' },
  { text: 'Я никогда не дарил(а) партнёру символичный, а не дорогой подарок', category: 'family' },
  { text: 'Я никогда не соглашался(ась) на свидание, хотя не было интереса', category: 'nsfw' },
  { text: 'Я никогда не оставался(ась) без сна больше трёх суток', category: 'extreme' },
  { text: 'Я никогда не прятал(а) от родных свои настоящие планы на выходные, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не делал(а) покупку только ради скидки', category: 'popular' },
  { text: 'Я никогда не торговал(а) своим настроением с близкими, потому что боялся(ась) реакции родных', category: 'family' },
  { text: 'Я никогда не вел(а) себя по-разному в чатах и в жизни', category: 'nsfw' },
  { text: 'Я никогда не участвовал(а) в снежной битве до полного выматывания', category: 'extreme' },
  { text: 'Я никогда не уходил(а) с вечеринки, не попрощавшись ни с кем', category: 'popular' },
  { text: 'Я никогда не обсуждал(а) свои страхи с любимым человеком открыто', category: 'family' },
  { text: 'Я никогда не соглашался(ась) на экстремальное приключение в последний момент, хотя друзья звали', category: 'extreme' },
  { text: 'Я никогда не писал(а) человеку, о котором давно нужно было забыть', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) больше трёх часов подряд в пробке', category: 'popular' },
  { text: 'Я никогда не участвовал(а) в забеге или марафоне без подготовки', category: 'extreme' },
  { text: 'Я никогда не проводил(а) с роднёй больше недели подряд', category: 'family' },
  { text: 'Я никогда не ставил(а) лайки бывшему специально, чтобы напомнить о себе', category: 'nsfw' },
  { text: 'Я никогда не притворялся(ась) больным, чтобы не идти на учёбу или работу', category: 'popular' },
  { text: 'Я никогда не обсуждал(а) с близким психотерапию или саморазвитие, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не катался(ась) на мотоцикле на большой скорости, даже на спор', category: 'extreme' },
  { text: 'Я никогда не игнорировал(а) красные флажки в поведении партнёра', category: 'nsfw' },
  { text: 'Я никогда не смеялся(ась) так громко, что на меня оборачивался весь зал', category: 'popular' },
  { text: 'Я никогда не устраивал(а) родителям праздник без их участия в подготовке', category: 'family' },
  { text: 'Я никогда не отправлялся(ась) в путь в неизвестном направлении без карты', category: 'extreme' },
  { text: 'Я никогда не переписывался(ась) с человеком, зная, что он не свободен', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) выходной без интернета, хотя иногда очень хотелось', category: 'popular' },
  { text: 'Я никогда не знакомил(а) партнёра с семьёй без стресса', category: 'family' },
  { text: 'Я никогда не поднимался(ась) на крышу высотки ради вида', category: 'extreme' },
  { text: 'Я никогда не игнорировал(а) человека, который явно проявлял интерес', category: 'nsfw' },
  { text: 'Я никогда не ел(а) еду ночью перед сном, хотя рассказывал(а) об этом, будто делал(а)', category: 'popular' },
  { text: 'Я никогда не обсуждал(а) свои страхи с любимым человеком открыто, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не нырял(а) в ледяную воду зимой, хотя друзья звали', category: 'extreme' },
  { text: 'Я никогда не возвращался(ась) к переписке, которую сам(а) завершил(а), хотя переписка заходила очень далеко', category: 'nsfw' },
  { text: 'Я никогда не забывал(а) важный день рождения близкого человека', category: 'popular' },
  { text: 'Я никогда не уезжал(а) с семьёй в спонтанное путешествие', category: 'family' },
  { text: 'Я никогда не катался(ась) на зиплайне над пропастью', category: 'extreme' },
  { text: 'Я никогда не устраивал(а) молчанку вместо честного разговора', category: 'nsfw' },
  { text: 'Я никогда не спорил(а) с кассиром из-за одной мелочи', category: 'popular' },
  { text: 'Я никогда не проводил(а) с роднёй больше недели подряд, хотя семья намекала на это', category: 'family' },
  { text: 'Я никогда не ночевал(а) в палатке в дикой природе в одиночку', category: 'extreme' },
  { text: 'Я никогда не скрывал(а) факт свидания от близких', category: 'nsfw' },
  { text: 'Я никогда не забывал(а) забрать сдачу в магазине', category: 'popular' },
  { text: 'Я никогда не дарил(а) партнёру символичный, а не дорогой подарок, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не отправлялся(ась) в поездку без брони и плана', category: 'extreme' },
  { text: 'Я никогда не устраивал(а) драму в соцсетях из-за личных чувств', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) фильм-марафон всю ночь до рассвета', category: 'popular' },
  { text: 'Я никогда не поддерживал(а) бабушек и дедушек технологически', category: 'family' },
  { text: 'Я никогда не катался(ась) на аттракционе, от которого всем становится плохо', category: 'extreme' },
  { text: 'Я никогда не писал(а) двусмысленные сообщения ради реакции', category: 'nsfw' },
  { text: 'Я никогда не подслушивал(а) чужой разговор специально', category: 'popular' },
  { text: 'Я никогда не уезжал(а) с семьёй в спонтанное путешествие, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не поднимался(ась) на высоту без страховки', category: 'extreme' },
  { text: 'Я никогда не вёл(а) себя по-разному в чатах и в жизни, хотя иногда было очень интересно', category: 'nsfw' },
  { text: 'Я никогда не терял(а) телефон в такси', category: 'popular' },
  { text: 'Я никогда не обсуждал(а) с близким психотерапию или саморазвитие', category: 'family' },
  { text: 'Я никогда не катался(ась) на сноуборде вне трасс, хотя друзья звали', category: 'extreme' },
  { text: 'Я никогда не возвращался(ась) к человеку, с которым уже всё закончилось', category: 'nsfw' },
  { text: 'Я никогда не залипал(а) в сериалы всю ночь до рассвета', category: 'popular' },
  { text: 'Я никогда не устраивал(а) семейный совет по собственной инициативе', category: 'family' },
  { text: 'Я никогда не перебирался(ась) через забор с колючей проволокой, даже на спор', category: 'extreme' },
  { text: 'Я никогда не возвращался(ась) к переписке после долгого молчания, как ни в чём не бывало', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) выходной без интернета', category: 'popular' },
  { text: 'Я никогда не проводил(а) выходные без друзей, только с семьёй, хотя знал(а), что это могло бы нас сблизить', category: 'family' },
  { text: 'Я никогда не катался(ась) на велосипеде по горам', category: 'extreme' },
  { text: 'Я никогда не устраивал(а) ревностную проверку в соцсетях', category: 'nsfw' },
  { text: 'Я никогда не забывал(а) оплатить коммуналку вовремя', category: 'popular' },
  { text: 'Я никогда не уезжал(а) в другой город ради отношений', category: 'family' },
  { text: 'Я никогда не катался(ась) по городу на скейте до изнеможения', category: 'extreme' },
  { text: 'Я никогда не пользовался(ась) комплиментами, чтобы сгладить конфликт', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) выходные полностью в пижаме', category: 'popular' },
  { text: 'Я никогда не устраивал(а) совместный кулинарный эксперимент, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не сидел(а) за рулём больше десяти часов подряд, даже ради ярких впечатлений', category: 'extreme' },
  { text: 'Я никогда не соглашался(ась) на прогулку, хотя не помнил(а) имя человека, даже ради эксперимента', category: 'nsfw' },
  { text: 'Я никогда не возвращал(а) покупку только потому что передумал(а)', category: 'popular' },
  { text: 'Я никогда не проводил(а) новогоднюю ночь только в кругу семьи, хотя семья намекала на это', category: 'family' },
  { text: 'Я никогда не играл(а) в уличных гонках', category: 'extreme' },
  { text: 'Я никогда не отвечал(а) на сообщения только тогда, когда скучно', category: 'nsfw' },
  { text: 'Я никогда не покупал(а) дорогую вещь и ни разу её не надевал(а)', category: 'popular' },
  { text: 'Я никогда не уступал(а) свои планы ради времени с семьёй', category: 'family' },
  { text: 'Я никогда не гулял(а) по городу всю ночь до рассвета', category: 'extreme' },
  { text: 'Я никогда не писал(а) кому-то «скучаю», не имея это в виду', category: 'nsfw' },
  { text: 'Я никогда не возвращал(а) покупку только потому что передумал(а), хотя рассказывал(а) об этом, будто делал(а)', category: 'popular' },
  { text: 'Я никогда не устраивал(а) родителям праздник без их участия в подготовке, хотя думал(а) об этом много раз', category: 'family' },
  { text: 'Я никогда не ел(а) еду из уличной забегаловки, о которой потом пожалел(а)', category: 'extreme' },
  { text: 'Я никогда не заводил(а) отношения из скуки', category: 'nsfw' },
  { text: 'Я никогда не проводил(а) выходные полностью в пижаме, а потом жалел(а), что не рискнул(а)', category: 'popular' },
  { text: 'Я никогда не делал(а) семейный альбом или архив фото', category: 'family' },
  { text: 'Я никогда не гулял(а) во время шторма или сильного ветра', category: 'extreme' },
  { text: 'Я никогда не игнорировал(а) границы другого человека в переписке, даже ради эксперимента', category: 'nsfw' },
  
  { text: 'Я никогда не назначал(а) свидание, не зная как человек выглядит в жизни', category: 'nsfw' },
{ text: 'Я никогда не покупал(а) дорогую вещь только ради настроения', category: 'popular' },
{ text: 'Я никогда не соглашался(ась) на позднюю прогулку с человеком, которого едва знал(а)', category: 'nsfw' },
{ text: 'Я никогда не забывал(а) важные документы дома в самый нужный момент', category: 'popular' },
{ text: 'Я никогда не спорил(а) с баристой из-за неправильного кофе', category: 'popular' },
{ text: 'Я никогда не смущался(ась) на свидании из-за случайной оговорки', category: 'nsfw' },
{ text: 'Я никогда не отправлял(а) голосовое, о котором потом жалел(а)', category: 'popular' },
{ text: 'Я никогда не начинал(а) общение только ради флирта', category: 'nsfw' },
{ text: 'Я никогда не забывал(а) выключить плиту перед выходом из дома', category: 'popular' },
{ text: 'Я никогда не флиртовал(а) с сотрудником сервиса или доставки', category: 'nsfw' },

{ text: 'Я никогда не совершал(а) импульсивных покупок ночью', category: 'popular' },
{ text: 'Я никогда не засыпал(а) в транспорте и не проезжал(а) свою остановку', category: 'popular' },
{ text: 'Я никогда не писал(а) человеку только потому что было скучно', category: 'nsfw' },
{ text: 'Я никогда не соглашался(ась) на встречу без точного понимания куда иду', category: 'nsfw' },
{ text: 'Я никогда не забывал(а) пароль от своих же устройств', category: 'popular' },
{ text: 'Я никогда не пересматривал(а) старые переписки ради ощущения', category: 'nsfw' },
{ text: 'Я никогда не тратил(а) деньги сразу после зарплаты', category: 'popular' },
{ text: 'Я никогда не ревновал(а) без причины, хотя думал(а) иначе', category: 'nsfw' },
{ text: 'Я никогда не брал(а) выходной просто ради сна', category: 'popular' },
{ text: 'Я никогда не отправлял(а) сообщение, которое должен был удалить', category: 'nsfw' },

{ text: 'Я никогда не забывал(а) поздравить близкого человека', category: 'family' },
{ text: 'Я никогда не устраивал(а) семейный ужин с нуля', category: 'family' },
{ text: 'Я никогда не смеялся(ась) над шуткой родственника, не поняв её', category: 'family' },
{ text: 'Я никогда не отменял(а) семейные планы без объяснений', category: 'family' },
{ text: 'Я никогда не дарил(а) символичный подарок без повода', category: 'family' },

{ text: 'Я никогда не пробовал(а) экстремальный аттракцион в парке', category: 'extreme' },
{ text: 'Я никогда не катался(ась) на качелях на максимальной высоте', category: 'extreme' },
{ text: 'Я никогда не участвовал(а) в спонтанном забеге', category: 'extreme' },
{ text: 'Я никогда не поднимался(ась) на крышу ради вида', category: 'extreme' },
{ text: 'Я никогда не гулял(а) в лесу поздним вечером', category: 'extreme' },

{ text: 'Я никогда не спорил(а) с кассиром по мелочам', category: 'popular' },
{ text: 'Я никогда не забывал(а) забрать сдачу', category: 'popular' },
{ text: 'Я никогда не покупал(а) еду только ради упаковки', category: 'popular' },
{ text: 'Я никогда не краснел(а) от комплимента незнакомца', category: 'popular' },
{ text: 'Я никогда не тратил(а) весь день на сериалы', category: 'popular' },

{ text: 'Я никогда не переходил(а) на «вы» в ссоре', category: 'nsfw' },
{ text: 'Я никогда не отвечал(а) на сообщение спустя дни', category: 'nsfw' },
{ text: 'Я никогда не ревновал(а) к человеку, с которым даже не встречался(ась)', category: 'nsfw' },
{ text: 'Я никогда не начинал(а) переписку ради внимания', category: 'nsfw' },
{ text: 'Я никогда не писал(а) что-то под эмоциями, а потом удалял(а)', category: 'nsfw' },

{ text: 'Я никогда не уезжал(а) в другой город без багажа', category: 'extreme' },
{ text: 'Я никогда не переходил(а) дорогу в неположенном месте, когда пусто', category: 'extreme' },
{ text: 'Я никогда не пробовал(а) кататься на доске без обучения', category: 'extreme' },
{ text: 'Я никогда не стоял(а) на краю обрыва ради фото', category: 'extreme' },
{ text: 'Я никогда не бегал(а) по лестницам на скорость', category: 'extreme' },

{ text: 'Я никогда не ссорился(ась) с родственником из-за пустяка', category: 'family' },
{ text: 'Я никогда не отказывал(а) близкому человеку в помощи', category: 'family' },
{ text: 'Я никогда не забывал(а) про семейные традиции', category: 'family' },
{ text: 'Я никогда не устраивал(а) сюрприз своим родным', category: 'family' },
{ text: 'Я никогда не обсуждал(а) важные вещи без уважения к родным', category: 'family' },

{ text: 'Я никогда не опаздывал(а) больше чем на час', category: 'popular' },
{ text: 'Я никогда не делал(а) вид что занят(а), хотя просто устал(а)', category: 'popular' },
{ text: 'Я никогда не спорил(а) в комментариях в интернете', category: 'popular' },
{ text: 'Я никогда не ел(а) сладкое перед сном', category: 'popular' },
{ text: 'Я никогда не откладывал(а) важные дела до последнего', category: 'popular' },

{ text: 'Я никогда не писал(а) человеку ночью, потому что стало одиноко', category: 'nsfw' },
{ text: 'Я никогда не проверял(а) соцсети бывшего', category: 'nsfw' },
{ text: 'Я никогда не отвечал(а) холодно специально', category: 'nsfw' },
{ text: 'Я никогда не начинал(а) флирт ради развлечения', category: 'nsfw' },
{ text: 'Я никогда не отправлял(а) признание в чувствах в неподходящий момент', category: 'nsfw' },

{ text: 'Я никогда не катался(ась) ночью на велосипеде по пустому городу', category: 'extreme' },
{ text: 'Я никогда не заходил(а) в заброшенное здание', category: 'extreme' },
{ text: 'Я никогда не участвовал(а) в ночной пробежке по трассе', category: 'extreme' },
{ text: 'Я никогда не переходил(а) мост в сильный ветер', category: 'extreme' },
{ text: 'Я никогда не подходил(а) слишком близко к краю платформы', category: 'extreme' },

{ text: 'Я никогда не забывал(а) поздравить родителей с праздником', category: 'family' },
{ text: 'Я никогда не обсуждал(а) серьёзные темы за семейным столом', category: 'family' },
{ text: 'Я никогда не спорил(а) с бабушкой по пустякам', category: 'family' },
{ text: 'Я никогда не оставлял(а) родных без ответа надолго', category: 'family' },
{ text: 'Я никогда не участвовал(а) в семейной ссоре как посредник', category: 'family' },

{ text: 'Я никогда не оставался(ась) дома весь день без плана', category: 'popular' },
{ text: 'Я никогда не ел(а) целый день только перекусы', category: 'popular' },
{ text: 'Я никогда не покупал(а) что-то только ради настроения', category: 'popular' },
{ text: 'Я никогда не пересматривал(а) один и тот же фильм десятки раз', category: 'popular' },
{ text: 'Я никогда не медлил(а) специально с ответом, чтобы выглядеть занято(й)', category: 'popular' }

]


const started = ref(false);
const activeCategory = ref('popular');
const randomCategory = { id: 'random', label: 'Случайно' };
const showFilters = ref(false);
const usedIndices = ref({ popular: new Set(), extreme: new Set(), family: new Set(), nsfw: new Set() });
const currentPhrase = ref('');
const currentCategoryForPhrase = ref(activeCategory.value);
const promptsSeen = ref(0);
const showPopup = ref(false);
const popupIndex = ref(0);

const socials = [
  {
    title: 'Подпишись на Telegram',
    text: 'Куча мемов, всё самое свежее тут',
    cta: 'Перейти в логово',
    link: 'https://t.me/neural_wise_wolf',
    emoji: '✉️'
  },
  {
    title: 'TikTok Волка',
    text: 'Мемы, стримы и много волков',
    cta: 'Смотреть TikTok',
    link: 'https://www.tiktok.com/@neural_wolf',
    emoji: '🎬'
  },
  {
    title: 'YouTube канал',
    text: 'Шортсы и длинные видосы с волками',
    cta: 'Открыть YouTube',
    link: 'https://www.youtube.com/@neural_wolf',
    emoji: '▶️'
  },
  {
    title: 'Залетай в Instagram',
    text: 'Самое первое и большое сообщество, много мемов с волками',
    cta: 'Открыть Instagram',
    link: 'https://instagram.com/neural_wise_wolf/',
    emoji: '📸'
  }
];

const popupPayload = computed(() => socials[popupIndex.value % socials.length]);

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Я никогда не' }
];

const mobileCategories = computed(() =>
  [randomCategory, ...categories].filter((c) => c.id !== activeCategory.value)
);

const selectedCategoryLabel = computed(() => {
  if (activeCategory.value === randomCategory.id) return randomCategory.label;
  const cat = categories.find((c) => c.id === activeCategory.value);
  return cat ? cat.label : '';
});

const currentLabel = computed(() => {
  const cat = categories.find((c) => c.id === currentCategoryForPhrase.value);
  return cat ? cat.label : '';
});

function getPhrasesByCategory(categoryId) {
  return phrases
    .map((p, idx) => ({ ...p, idx }))
    .filter((p) => p.category === categoryId);
}

function pickCategoryForPhrase() {
  if (activeCategory.value !== randomCategory.id) return activeCategory.value;
  const idx = Math.floor(Math.random() * categories.length);
  return categories[idx]?.id || categories[0]?.id || 'popular';
}

function pickRandom() {
  const categoryForPhrase = pickCategoryForPhrase();
  currentCategoryForPhrase.value = categoryForPhrase;
  const list = getPhrasesByCategory(categoryForPhrase);
  if (!list.length) {
    currentPhrase.value = '';
    return;
  }
  const used = usedIndices.value[categoryForPhrase];
  const available = list.filter((item) => !used.has(item.idx));
  if (!available.length) {
    currentPhrase.value = '';
    return;
  }
  const choice = available[Math.floor(Math.random() * available.length)];
  used.add(choice.idx);
  currentPhrase.value = choice.text;
  handlePopup();
}

function nextPhrase() {
  pickRandom();
}

function setCategory(cat) {
  activeCategory.value = cat;
  pickRandom();
}

function handleCategorySelect(cat) {
  setCategory(cat);
  showFilters.value = false;
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function startGame() {
  started.value = true;
  pickRandom();
}

function handlePopup() {
  promptsSeen.value += 1;
  if (promptsSeen.value % 5 === 0) {
    showPopup.value = true;
  }
}
function handlePopupClose() {
  showPopup.value = false;
  popupIndex.value = (popupIndex.value + 1) % socials.length;
}
</script>

<style scoped>
.nhi-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(8px, 2.2vw, 18px);
  background: transparent;
  color: #e5e7eb;
  text-align: center;
  box-sizing: border-box;
}

.nhi-content {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  justify-items: center;
  padding: clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 26px);
  margin: 0 auto;
}

.nhi-hero,
.nhi-game {
  width: 100%;
  text-align: center;
}

.nhi-hero h1 {
  margin: 0 0 6px;
  font-size: clamp(34px, 7vw, 64px);
  letter-spacing: 0;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.nhi-hero {
  text-align: center;
  display: grid;
  gap: clamp(16px, 4vw, 26px);
  justify-items: center;
  align-items: center;
  align-content: center;
  padding: clamp(6px, 2.2vw, 18px) 0 clamp(10px, 3vw, 18px);
  max-width: 900px;
  margin: 0 auto;
  min-height: clamp(56vh, 72vw, 66vh);
}

.nhi-sub {
  margin: 6px 0 14px;
  color: #cbd5e1;
  line-height: 1.55;
  max-width: 760px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-size: clamp(15px, 2vw, 18px);
}

.nhi-hero p {
  margin: 0;
}

.nhi-cta {
  margin: 8px auto 10px;
  padding: clamp(14px, 2.4vw, 18px) clamp(20px, 3vw, 28px);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: clamp(15px, 2vw, 18px);
  background: linear-gradient(120deg, #ff7eb6, #ff4d6d);
  color: #0f172a;
  box-shadow: 0 15px 30px rgba(255, 126, 182, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.nhi-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(255, 126, 182, 0.45);
}

.nhi-cta:active {
  transform: translateY(0);
}

.nhi-cta-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #ff4d6d;
  font-size: 14px;
}

.nhi-game {
  display: grid;
  gap: clamp(14px, 2.6vw, 26px);
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  padding: clamp(6px, 1.2vw, 12px) 0 clamp(12px, 2.4vw, 22px);
  margin-top: 0;
  width: 100%;
}

.nhi-filters {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 14px);
  justify-content: center;
  margin-bottom: 0;
  margin-top: clamp(-6px, -0.6vw, -2px);
  width: 100%;
  max-width: 900px;
}

.nhi-filters-mobile {
  display: none;
  width: min(520px, 100%);
  margin: 0 auto;
  gap: 10px;
  justify-items: center;
}

.nhi-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  border-radius: 999px;
  padding: clamp(10px, 2vw, 14px) clamp(14px, 3vw, 18px);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 800;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  min-width: 160px;
  max-width: 220px;
}

.nhi-chip-primary {
  animation: nhi-pulse 5s ease-in-out infinite;
}

.nhi-filters-extra {
  display: grid;
  gap: 10px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  justify-items: center;
}

.nhi-filters-extra.open {
  max-height: 420px;
  opacity: 1;
}

@media (max-width: 980px) {
  .nhi-chip {
    flex: 0 1 200px;
  }
}

.nhi-chip-active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e5e7eb;
}

.nhi-chip-icon {
  font-size: 16px;
}

.nhi-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: 320px;
  margin: -40px auto 0;
  box-shadow: none;
}

.nhi-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.nhi-label {
  font-size: 15px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.nhi-phrase {
  margin: 6px 0 4px;
  min-height: 200px;
  display: grid;
  place-items: center;
}

.nhi-phrase p {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.4;
  color: #e5e7eb;
  margin: 0;
  text-align: center;
}

.nhi-next {
  border: none;
  padding: 14px 28px;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(56, 189, 248, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.nhi-next:hover {
  transform: translateY(-2px);
}

.nhi-next:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .nhi-shell {
    align-items: flex-start;
    padding: 4px 16px 12px;
  }

  .nhi-content {
    padding: 4px 12px 10px;
  }

  .nhi-chip {
    width: 100%;
    justify-content: center;
  }

  .nhi-filters {
    display: none;
  }

  .nhi-filters-mobile {
    display: grid;
  }

  .nhi-hero {
    gap: 16px;
    padding: 4px 0 8px;
    min-height: 70vh;
    margin-top: -20px;
  }

  .nhi-hero h1 {
    font-size: clamp(30px, 9vw, 46px);
    line-height: 1.08;
  }

  .nhi-sub {
    max-width: 92%;
    font-size: 15px;
  }

  .nhi-cta {
    padding: 12px 22px;
  }

  .nhi-phrase {
    margin: 20px 0 18px;
  }

  .nhi-phrase p {
    font-size: 24px;
  }

  .nhi-game {
    margin-top: 0;
  }

  .nhi-card {
    margin-top: 0;
  }
}

@keyframes nhi-pulse {
  0%,
  88%,
  100% {
    transform: translateY(0);
  }
  92% {
    transform: translateY(-2px);
  }
  96% {
    transform: translateY(1px);
  }
}
</style>
