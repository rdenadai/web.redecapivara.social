<template>
  <div v-html="parsedContent" class="whitespace-pre-wrap break-word text-black/70"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  embed: {
    type: Object,
    required: false,
    default: null,
  },
})

const parsedContent = computed(() => {
  let content = props.content || ''

  // Collect replacement HTML snippets in an array and use placeholders so we don't double-replace.
  const replacements = []

  // Handle pattern: @ followed by alphanumeric then any combination of . _ -
  const handleRegex = /(?<=\s|^)@([A-Za-z0-9][A-Za-z0-9._-]*(?:\.[A-Za-z0-9._-]+)*)/g

  // Replace handles with placeholders first so they won't be mistaken for URLs.
  content = content.replace(handleRegex, (full, name) => {
    const key = `__PLACEHOLDER_${replacements.length}__`
    replacements.push(`<a href="/${name}/profile" class="text-capivara-brown hover:underline">@${name}</a>`)
    return key
  })

  // URL pattern that matches with or without protocol, supports subdomains, multi-part TLDs, localhost, IPv4, ports and paths/queries/fragments (paths may include @ like /@username)
  const urlRegex =
    /((?:https?:\/\/)?(?:www\.)?(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}|localhost|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:[\/?#][^\s]*)?/g

  // Replace URLs with placeholders. Skip placeholders that were inserted above.
  content = content.replace(urlRegex, (match) => {
    // If this is one of our placeholders, leave it alone.
    if (/^__PLACEHOLDER_\d+__$/.test(match)) return match

    let href = /^https?:\/\//i.test(match) ? match : `https://${match}`
    if (props.embed?.external?.uri) {
      if (props.embed.external.uri.includes(match.replace('...', ''))) {
        href = props.embed.external.uri
      }
    }

    const key = `__PLACEHOLDER_${replacements.length}__`
    replacements.push(
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-capivara-brown hover:underline">${match}</a>`
    )
    return key
  })

  // Preserve new lines
  content = content.replaceAll('\n', '<br />')

  // Restore placeholders to their HTML
  replacements.forEach((html, idx) => {
    const key = `__PLACEHOLDER_${idx}__`
    content = content.split(key).join(html)
  })

  return content
})
</script>
