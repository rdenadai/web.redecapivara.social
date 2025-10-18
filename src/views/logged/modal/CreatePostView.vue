<template>
  <Transition name="modal">
    <dialog
      v-show="props.show"
      ref="dialogRef"
      class="border-1 border-gray-300 fixed mx-auto top-16 md:align-middle max-w-200 h-screen md:h-fit md:rounded-lg"
    >
      <div>
        <div class="w-full flex justify-between items-center p-1">
          <button class="btn btn-no-outline hover:bg-capivara-stone/100 hover:text-white" @click="closeModal">
            Fechar
          </button>
          <button
            class="btn"
            @click="submitPost"
            :disabled="enablePostButton"
            :class="[enablePostButton ? 'btn-disabled' : 'btn-primary']"
          >
            Publicar
          </button>
        </div>
        <div class="form-control w-full">
          <div class="w-full p-5 mt-auto">
            <div class="flex">
              <img
                v-if="profileData.avatar"
                :src="profileData.avatar"
                alt="Avatar"
                class="w-14 h-14 rounded-full object-cover"
              />
              <div
                ref="messageDiv"
                contenteditable="true"
                data-placeholder="O que está acontecendo?"
                :class="[
                  'editable-placeholder w-full min-h-[80px] max-h-64 overflow-y-auto outline-none resize-none px-3 text-xl md:text-sm',
                  isSendingMessage ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                ]"
                :readonly="isSendingMessage"
                :disabled="isSendingMessage"
                @input="inputEvent"
                @keydown.enter.shift.prevent="sendChatMessage"
              ></div>
            </div>
            <!-- Separator -->
            <div class="flex border-t border-capivara-stone/20 w-full mt-4"></div>
            <div class="flex py-2">
              <div class="relative" ref="emojiContainerRef">
                <!-- Botões de ação image, gif and emoji -->
                <button
                  class="btn-no-outline hover:bg-capivara-stone/100 hover:text-white mr-2 p-2 rounded-full"
                  :disabled="isSendingMessage"
                  title="Adicionar imagem (em breve)"
                >
                  <ImageIcon class="!md:w-6 !md:h-6" />
                </button>
                <button
                  class="btn-no-outline hover:bg-capivara-stone/100 hover:text-white mr-2 p-2 rounded-full"
                  :disabled="isSendingMessage"
                  title="Adicionar GIF (em breve)"
                >
                  <GifIcon class="!md:w-6 !md:h-6" />
                </button>
                <button
                  ref="emojiButtonRef"
                  :disabled="isSendingMessage"
                  @click="() => (showEmojiPicker = !showEmojiPicker)"
                  class="btn-no-outline hover:bg-capivara-stone/100 hover:text-white mr-2 p-2 rounded-full"
                  title="Adicionar emoji"
                >
                  <EmojiIcon class="!md:w-6 !md:h-6" />
                </button>
                <div v-if="showEmojiPicker" ref="emojiPickerRef" class="emoji-picker-container">
                  <EmojisView @emoji-selected="emojiSelected" />
                </div>
              </div>
              <!-- div com o numero total de caracteres digitados-->
              <div class="ml-auto text-right text-sm text-gray-500 mt-1 text-xl md:text-sm">
                {{ postMaxLength - postContent.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Transition>
</template>

<script setup>
import { computed, defineEmits, defineProps, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useProfile } from '@/composables/useProfile'
import { createPost } from '@/services/atproto'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import GifIcon from '@/components/icons/GifIcon.vue'
import EmojiIcon from '@/components/icons/EmojiIcon.vue'
import EmojisView from '@/components/EmojisView.vue'

const toast = useToast()
const authStore = useAuthStore()

const postMaxLength = 300

const emit = defineEmits(['close', 'postCreated'])

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const { profileData } = useProfile()

const dialogRef = ref(null)
const messageDiv = ref(null)
const postContent = ref('')
const isSendingMessage = ref(false)
const textareaRowsNumber = ref(1)
const showEmojiPicker = ref(false)
const emojiPickerRef = ref(null)
const emojiButtonRef = ref(null)
const emojiContainerRef = ref(null)

const enablePostButton = computed(() => postContent.value.trim().length === 0 || isSendingMessage.value)

const inputEvent = (e) => validateContent(e.target.innerText.trim())

const emojiSelected = (emoji) => {
  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  if (range && messageDiv.value.contains(range.commonAncestorContainer)) {
    // Insere o emoji na posição do cursor
    const textNode = document.createTextNode(emoji)
    range.deleteContents()
    range.insertNode(textNode)

    // Move o cursor para depois do emoji inserido
    range.setStartAfter(textNode)
    range.setEndAfter(textNode)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    // Se não houver seleção válida, adiciona no final
    messageDiv.value.innerText += emoji
  }

  validateContent(messageDiv.value.innerText.trim())
  showEmojiPicker.value = false
}

const validateContent = (content) => {
  if (content.length > postMaxLength) {
    postContent.value = content.substring(0, postMaxLength)
    messageDiv.value.innerText = postContent.value
    // Move o cursor para o final do texto
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(messageDiv.value)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  } else {
    postContent.value = content
    if (content.length === 0) {
      messageDiv.value.innerHTML = ''
    }
  }
  adjustTextarea()
}

const adjustTextarea = () => {
  const textarea = messageDiv.value
  textarea.rows = textareaRowsNumber.value // Reset to minimum rows
  const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
  const rows = Math.floor(textarea.scrollHeight / lineHeight)
  textarea.rows = rows < 8 ? rows : 8 // Set rows up to a maximum of 8
}

const closeModal = () => {
  dialogRef.value?.close()
  emit('close')
}

const submitPost = async () => {
  if (postContent.value.trim() === '') {
    toast.error('O conteúdo da publicação não pode estar vazio.')
    return
  }

  try {
    isSendingMessage.value = true
    await createPost(authStore.server, authStore.accessToken, authStore.did, postContent.value.trim())
    toast.success('Publicação criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar publicação:', error)
    toast.error('Erro ao criar publicação. Tente novamente.')
  } finally {
    isSendingMessage.value = false
    emit('postCreated', postContent.value)
    postContent.value = ''
    if (messageDiv.value) {
      messageDiv.value.innerHTML = ''
    }
    closeModal()
  }
}

// Detecta clique fora do emoji picker
const handleClickOutside = (event) => {
  if (
    showEmojiPicker.value &&
    emojiPickerRef.value &&
    emojiButtonRef.value &&
    !emojiPickerRef.value.contains(event.target) &&
    !emojiButtonRef.value.contains(event.target)
  ) {
    showEmojiPicker.value = false
  }
}

onMounted(() => {
  messageDiv.value.focus()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      postContent.value = ''
      textareaRowsNumber.value = 1
      dialogRef.value?.showModal()
      if (messageDiv.value) {
        messageDiv.value.innerHTML = ''
      }
      messageDiv.value?.focus()
    } else {
      dialogRef.value?.close()
      showEmojiPicker.value = false
    }
  }
)
</script>

<style scoped>
.editable-placeholder:empty::before {
  content: attr(data-placeholder);
  color: rgb(156 163 175); /* text-gray-400 equivalent */
  pointer-events: none;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from {
  transform: translateY(-50px);
  opacity: 0;
}
.modal-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.emoji-picker-container {
  position: fixed;
  z-index: 9999;
  top: 280px;
  left: 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 8px;
  background: white;
}
@media (min-width: 768px) {
  .emoji-picker-container {
    bottom: auto;
    left: auto;
    top: auto;
    right: auto;
    transform: translateY(-10%) translateX(40%);
  }
}
</style>
