export interface JumpInputState {
  left: boolean
  right: boolean
}

export const createWolfJumpInput = (onStart?: () => void) => {
  const state: JumpInputState = { left: false, right: false }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      state.left = true
      return
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      state.right = true
      return
    }
    if (event.code === 'Space') {
      event.preventDefault()
      onStart?.()
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      state.left = false
      return
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      state.right = false
    }
  }

  const setLeft = (value: boolean) => {
    state.left = value
  }

  const setRight = (value: boolean) => {
    state.right = value
  }

  const getState = () => ({ ...state })

  const attach = () => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }

  const detach = () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }

  return {
    attach,
    detach,
    setLeft,
    setRight,
    getState
  }
}
