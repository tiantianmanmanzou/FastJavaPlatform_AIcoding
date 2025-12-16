export const PROMPT_DATA_UPDATED_EVENT = 'prompt-data-updated'

export const emitPromptDataUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROMPT_DATA_UPDATED_EVENT))
  }
}
