<template>
  <main class="max-w-7xl mx-auto md:px-4 md:py-4">
    <div class="card mb-8 bg-gradient-to-r text-white">
      <div>
        <h1 class="text-2xl font-bold mb-2 text-black/80 px-4 py-4">Notificações ({{ allNotifications }})</h1>
        <div v-if="loading" class="text-center text-gray-500">Carregando...</div>
        <div v-if="error" class="text-center text-red-500">{{ error }}</div>
        <div v-if="!loading && !error && notifications.length === 0" class="text-center text-gray-500">
          Nenhuma notificação.
        </div>
        <ul v-if="!loading && !error && notifications.length > 0">
          <li v-for="notification in notifications" :key="notification.id">
            <div class="p-4 hover:bg-gray-50 cursor-pointer">
              <router-link :to="parseNotificationPostUrl(notification)" class="flex items-start space-x-3">
                <div class="flex items-start space-x-3">
                  <div class="flex-1 min-w-0">
                    <!-- if notification.grouped > 1 we add a card with dropdown other wise a single card -->
                    <div
                      v-if="notification.grouped.length > 1"
                      class="mb-2 flex flex-col items-start space-x-3 text-capivara-brown"
                    >
                      <div class="flex">
                        <NotificationIcons :reason="notification.reason" />
                        <div v-for="item in notification.grouped.slice(0, 5)" :key="item.id">
                          <div class="flex items-center space-x-3 text-capivara-brown">
                            <div v-if="item.author?.avatar" class="pl-1">
                              <img
                                :src="item.author.avatar"
                                :title="item.author?.displayName || item.author?.handle"
                                :alt="item.author?.displayName || item.author?.handle"
                                class="w-10 h-10 rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="notification.grouped.length > 5"
                          class="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full text-sm font-medium ml-1"
                        >
                          +{{ notification.grouped.length - 5 }}
                        </div>
                      </div>
                      <div class="mt-2 pl-13">
                        <strong class="truncate">
                          {{ notification.grouped[0].author?.displayName || notification.grouped[0].author?.handle }}
                        </strong>
                        e
                        <span class="items-center font-semibold">{{ notification.grouped.length - 1 }}</span>
                        outro{{ notification.grouped.length > 2 ? 's' : '' }}
                        {{ notificationReasonMessages[notification.reason] }}
                        <span class="text-gray-500 text-xs">
                          •
                          {{ numberOfHoursOrMinutesAgo(notification.grouped[0].record.createdAt) + ' atrás' }}
                        </span>
                      </div>
                    </div>

                    <!-- single notification -->
                    <div v-else class="flex flex-col items-start space-x-3 text-capivara-brown">
                      <div class="flex items-center text-capivara-brown">
                        <NotificationIcons :reason="notification.reason" />
                        <div v-if="notification.grouped[0].author?.avatar" class="pl-1">
                          <img
                            :src="notification.grouped[0].author.avatar"
                            :title="
                              notification.grouped[0].author?.displayName || notification.grouped[0].author?.handle
                            "
                            :alt="notification.grouped[0].author?.displayName || notification.grouped[0].author?.handle"
                            class="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div class="mt-2 pl-13">
                        <strong class="truncate">
                          {{ notification.grouped[0].author?.displayName || notification.grouped[0].author?.handle }}
                        </strong>
                        {{ notificationReasonMessages[notification.reason] }}
                        <span class="text-gray-500 text-xs">
                          •
                          {{ numberOfHoursOrMinutesAgo(notification.grouped[0].record.createdAt) + ' atrás' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
            <div class="flex border-t border-capivara-stone/10 w-full"></div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
<script setup>
import { computed, ref, onMounted, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getNotifications, updateNotificationSeen } from '@/services/atproto'
import { numberOfHoursOrMinutesAgo } from '@/utils'
import NotificationIcons from '@/components/NotificationIcons/index.vue'

const authStore = useAuthStore()

const notifications = ref([])
const loading = ref(false)
const error = ref(null)

const notificationReasonMessages = {
  like: 'curtiu seu post',
  'like-via-repost': 'curtiu seu repost',
  repost: 'repostou seu post',
  'repost-via-repost': 'repostou seu repost',
  follow: 'começou a seguir você',
  mention: 'mencionou você em um post',
  reply: 'respondeu ao seu post',
}

const allNotifications = computed(() => notifications.value.reduce((acc, notif) => acc + notif.grouped.length, 0))

const parseNotificationPostUrl = (notification) => {
  if (
    (notification.reason === 'mention' ||
      notification.reason === 'reply' ||
      notification.reason === 'repost' ||
      notification.reason === 'like') &&
    notification.reasonSubject
  ) {
    const reasonSubject = notification.reasonSubject.replace('at://', '')
    const parts = reasonSubject.split('/')
    if (parts.length === 3) {
      const handle = parts[0]
      const postId = parts[2]
      return `/${handle}/post/${postId}`
    }
  } else if (notification.reason === 'follow') {
    return `/${notification.grouped[0].author?.handle}/profile`
  }
  return '/'
}

const fetchNotifications = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getNotifications(authStore.server, authStore.accessToken, authStore.did, 100)
    if (response && Array.isArray(response.notifications)) {
      const groupedMap = new Map()
      response.notifications.forEach((notif) => {
        const key = `${notif.reason}-${notif.reasonSubject}`
        if (!groupedMap.has(key)) {
          // Need to check if notif is already in the map to avoid duplicates
          if (groupedMap.get(key)?.grouped.some((n) => n.id === notif.id)) {
            return
          }
          groupedMap.set(key, {
            reason: notif.reason,
            reasonSubject: notif.reasonSubject,
            grouped: [notif],
          })
        } else {
          groupedMap.get(key).grouped.push(notif)
          if (new Date(notif.createdAt) > new Date(groupedMap.get(key).createdAt)) {
            groupedMap.get(key).createdAt = notif.createdAt
          }
        }
      })
      notifications.value = Array.from(groupedMap.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else {
      error.value = 'Failed to load notifications.'
    }
  } catch (err) {
    console.error('Error fetching notifications:', err)
    error.value = 'An error occurred while fetching notifications.'
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (notifications.value.length > 0) {
    for (const notif of notifications.value) {
      const item = notif.grouped[0]
      if (item.isRead === false) {
        const latestCreatedAt = item.record?.createdAt || null
        if (latestCreatedAt) {
          updateNotificationSeen(authStore.server, authStore.accessToken, new Date(Date.now()).toISOString()).catch(
            (err) => {
              console.error('Error updating notification seen:', err)
            }
          )
        }
      }
    }
    // const latestNotification = notifications.value[0];
    // if (latestNotification && latestNotification.grouped.length > 0) {
    //   const latestCreatedAt =
    //     latestNotification.grouped[0].record?.createdAt || null;
    //   if (latestCreatedAt) {
    //     updateNotificationSeen(
    //       authStore.server,
    //       authStore.accessToken,
    //       latestCreatedAt
    //     ).catch((err) => {
    //       console.error("Error updating notification seen:", err);
    //     });
    //   }
    // }
  }
})

onMounted(async () => {
  await fetchNotifications()
})
</script>
