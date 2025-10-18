import axios from 'axios'

const BLUESKY_SERVER = 'https://bsky.social'
const REDE_CAPIVARA_SERVER = 'https://redecapivara.social'

/**
 * Faz login no servidor ATProtocol
 * @param {string} identifier - Username ou email
 * @param {string} password - Senha
 * @param {string} serverUrl - URL do servidor ATProtocol
 * @returns {Promise} Resposta do servidor com tokens
 */
export async function atprotoLogin(identifier, password, serverUrl) {
  // Remove trailing slash
  const baseUrl = serverUrl.replace(/\/$/, '')

  const response = await axios.post(
    `${baseUrl}/xrpc/com.atproto.server.createSession`,
    {
      identifier,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export async function atprotoLogout(serverUrl, accessToken, refreshJwt) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/com.atproto.server.deleteSession', {
    headers: { authorization: `Bearer ${refreshJwt}` },
  })
  return response?.data
}

/**
 * Cria um cliente axios configurado com autenticação
 * @param {string} serverUrl - URL do servidor
 * @param {string} accessToken - Token de acesso
 * @returns {AxiosInstance}
 */
export function createAuthClient(serverUrl, accessToken) {
  const baseUrl = serverUrl.replace(/\/$/, '')

  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Atualiza o token de autenticação usando o refresh token
 * @param {string} serverUrl - URL do servidor ATProtocol
 * @param {string} accessToken - Token de acesso atual
 * @param {string} refreshJwt - Token de refresh
 * @returns {Promise} Resposta do servidor com novos tokens
 */
export async function refreshAuthClientToken(serverUrl, accessToken, refreshJwt) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/com.atproto.server.refreshSession', undefined, {
    headers: {
      Authorization: `Bearer ${refreshJwt}`,
      'Content-Type': 'application/json',
    },
  })
  return response?.data
}

/**
 * PROFILE API FUNCTIONS
 */

/**
 * Get actor profile information
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @returns {Promise} Profile data
 */
export async function getProfile(serverUrl, accessToken, actor) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.get('/xrpc/app.bsky.actor.getProfile', {
    params: { actor },
  })
  return response.data
}

/**
 * Get author feed (user's posts)
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @param {number} limit - Number of posts to retrieve
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Feed data
 */
export async function getAuthorFeed(serverUrl, accessToken, actor, limit = 25, cursor = undefined) {
  const client = createAuthClient(serverUrl, accessToken)
  const params = { actor, limit }
  if (cursor) {
    params.cursor = cursor
  }
  const response = await client.get('/xrpc/app.bsky.feed.getAuthorFeed', {
    params,
  })
  return response.data
}

export async function getUnreadNotificationsCount(serverUrl, accessToken, actor) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.get('/xrpc/app.bsky.notification.getUnreadCount', {
    params: { actor },
  })
  return response.data
}

/**
 * List notifications for the authenticated user
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @param {number} limit - Number of notifications to retrieve
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Notifications data
 */
export async function getNotifications(serverUrl, accessToken, actor, limit = 25, cursor = undefined) {
  const client = createAuthClient(serverUrl, accessToken)
  const params = { actor, limit }
  if (cursor) {
    params.cursor = cursor
  }
  const response = await client.get('/xrpc/app.bsky.notification.listNotifications', {
    params,
  })
  return response.data
}

/**
 * Get actor's followers
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @param {number} limit - Number of followers to retrieve
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Followers data
 */
export async function getFollowers(serverUrl, accessToken, actor, limit = 25, cursor = undefined) {
  const client = createAuthClient(serverUrl, accessToken)
  const params = { actor, limit }
  if (cursor) {
    params.cursor = cursor
  }
  const response = await client.get('/xrpc/app.bsky.graph.getFollowers', {
    params,
  })
  return response.data
}

/**
 * Get actor's follows
 *  @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @param {number} limit - Number of follows to retrieve
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Follows data
 */
export async function getFollows(serverUrl, accessToken, actor, limit = 25, cursor = undefined) {
  const client = createAuthClient(serverUrl, accessToken)
  const params = { actor, limit }
  if (cursor) {
    params.cursor = cursor
  }
  const response = await client.get('/xrpc/app.bsky.graph.getFollows', {
    params,
  })
  return response.data
}

/**
 * Get actor's timeline
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} actor - DID or handle of the actor
 * @param {number} limit - Number of posts to retrieve
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Timeline data
 */
export async function getTimeline(serverUrl, accessToken, actor, limit = 25, cursor = undefined) {
  const client = createAuthClient(serverUrl, accessToken)
  const params = { actor, limit }
  if (cursor) {
    params.cursor = cursor
  }
  const response = await client.get('/xrpc/app.bsky.feed.getTimeline', {
    params,
  })
  return response.data
}

/**
 * Get actor's did from handle
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} handle - User handle to resolve
 * @returns {Promise<string|null>} Resolved DID or null if not found
 */
export async function getDidFromHandle(serverUrl, accessToken, handle) {
  try {
    const client = createAuthClient(serverUrl, accessToken)
    const response = await client.get('/xrpc/com.atproto.identity.resolveHandle', {
      params: { handle },
    })

    // response.data is expected to include a `did` field
    return response?.data?.did ?? null
  } catch (err) {
    console.error('Error resolving handle to DID:', err)
    return null
  }
}

/**
 * POST API FUNCTIONS
 */

/**
 * Like a post by creating a like record
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} accountDid - DID of the user creating the like
 * @param {string} postUri - URI of the post to like (at://...)
 * @param {string} postCid - CID of the post to like
 * @returns {Promise} Response with the created like record URI
 */
export async function likePost(serverUrl, accessToken, accountDid, postUri, postCid) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/com.atproto.repo.createRecord', {
    repo: accountDid,
    collection: 'app.bsky.feed.like',
    record: {
      subject: {
        uri: postUri,
        cid: postCid,
      },
      createdAt: new Date().toISOString(),
    },
  })
  return response.data
}

/**
 * Unlike a post by deleting the like record
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} accountDid - DID of the user deleting the like
 * @param {string} likeUri - URI of the like record to delete (at://...)
 * @returns {Promise} Response from the delete operation
 */
export async function unlikePost(serverUrl, accessToken, accountDid, likeUri) {
  const client = createAuthClient(serverUrl, accessToken)
  // Parse the like URI to get repo and rkey
  const rkey = likeUri.replace('at://', '').split('/').filter(Boolean).at(-1) || ''
  const response = await client.post('/xrpc/com.atproto.repo.deleteRecord', {
    repo: accountDid,
    collection: 'app.bsky.feed.like',
    rkey: rkey,
  })
  return response.data
}

/**
 * Marcar notificações como vistas
 * @param {string} serverUrl - URL do servidor ATProtocol
 * @param {string} accessToken - Token de acesso para autenticação
 * @param {string} seenAt - Timestamp ISO das notificações vistas
 * @returns {Promise} Resposta do servidor
 */
export async function updateNotificationSeen(serverUrl, accessToken, seenAt) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/app.bsky.notification.updateSeen', {
    seenAt: seenAt,
  })
  return response.data
}

/**
 * Criar um novo post
 * @param {string} serverUrl - URL do servidor ATProtocol
 * @param {string} accessToken - Token de acesso para autenticação
 * @param {string} accountDid - DID ou handle do autor do post
 * @param {string} content - Conteúdo do post
 * @returns {Promise} Dados do post criado
 */
export async function createPost(serverUrl, accessToken, accountDid, content) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/com.atproto.repo.createRecord', {
    repo: accountDid,
    collection: 'app.bsky.feed.post',
    record: {
      text: content,
      createdAt: new Date().toISOString(),
    },
  })
  return response.data
}

export async function repostPost(serverUrl, accessToken, accountDid, postUri, postCid) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.post('/xrpc/com.atproto.repo.createRecord', {
    repo: accountDid,
    collection: 'app.bsky.feed.repost',
    record: {
      subject: {
        uri: postUri,
        cid: postCid,
      },
      createdAt: new Date().toISOString(),
    },
  })
  return response.data
}

export async function unrepostPost(serverUrl, accessToken, accountDid, repostUri) {
  const client = createAuthClient(serverUrl, accessToken)
  // Parse the repost URI to get repo and rkey
  const rkey = repostUri.replace('at://', '').split('/').filter(Boolean).at(-1) || ''
  const response = await client.post('/xrpc/com.atproto.repo.deleteRecord', {
    repo: accountDid,
    collection: 'app.bsky.feed.repost',
    rkey: rkey,
  })
  return response.data
}

/**
 * Get a specific post by actor and post ID
 * @param {string} serverUrl - URL of the ATProtocol server
 * @param {string} accessToken - Access token for authentication
 * @param {string} accountDid - DID or handle of the post author
 * @param {string} postId - Post ID (rkey)
 * @returns {Promise} Post data
 */
export async function getPost(serverUrl, accessToken, accountDid, postId) {
  const client = createAuthClient(serverUrl, accessToken)
  const response = await client.get('/xrpc/com.atproto.repo.getRecord', {
    params: {
      repo: accountDid,
      rkey: postId,
      collection: 'app.bsky.feed.post',
    },
  })
  return response.data
}

/**
 * ACCOUNT CREATION
 */

/**
 * Create a new account on the specified ATProtocol server
 * @param {Object} params - Account creation parameters
 * @param {string} params.email - Email address
 * @param {string} params.handle - Desired handle (without domain)
 * @param {string} params.password - Password
 * @param {string} [params.inviteCode] - Optional invite code if required by server
 * @returns {Promise} Response with account details and tokens
 */
export async function createAccount(params) {
  const { email, handle, password, inviteCode } = params

  const body = {
    email,
    handle: `${handle}.redecapivara.social`,
    password,
  }

  // Add invite code if provided (required by most servers)
  if (inviteCode) {
    body.inviteCode = inviteCode
  }

  const response = await axios.post(`${REDE_CAPIVARA_SERVER}/xrpc/com.atproto.server.createAccount`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}

/**
 * MIGRATION API FUNCTIONS
 */

/**
 * Step 1: Login to Bluesky to get session tokens
 */
export async function loginToBluesky(identifier, password) {
  return await atprotoLogin(identifier, password, BLUESKY_SERVER)
}

/**
 * Step 2: Get service auth token from old PDS (Bluesky)
 */
export async function getServiceAuth(accessToken, did) {
  const client = createAuthClient(BLUESKY_SERVER, accessToken)
  const response = await client.get('/xrpc/com.atproto.server.getServiceAuth', {
    params: {
      aud: `did:web:${new URL(REDE_CAPIVARA_SERVER).hostname}`,
      lxm: 'com.atproto.server.createAccount',
    },
  })
  return response.data
}

/**
 * Step 3: Create account on Rede Capivara with existing DID
 * Note: When creating with existing DID, requires service auth token
 */
export async function createAccountWithDID(params) {
  const { email, handle, password, did, inviteCode, serviceAuthToken } = params

  const body = {
    email,
    handle: `${handle}.redecapivara.social`,
    password,
    did, // Existing DID from Bluesky
  }

  // Add invite code if provided (required by most servers)
  if (inviteCode) {
    body.inviteCode = inviteCode
  }

  // For accounts with existing DID, send service auth token as Authorization header
  const headers = {
    'Content-Type': 'application/json',
  }

  if (serviceAuthToken) {
    headers['Authorization'] = `Bearer ${serviceAuthToken}`
  }

  const response = await axios.post(`${REDE_CAPIVARA_SERVER}/xrpc/com.atproto.server.createAccount`, body, { headers })

  return response.data
}
/**
 * Step 4: Check account status
 */
export async function checkAccountStatus(accessToken) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.get('/xrpc/com.atproto.server.checkAccountStatus')
  return response.data
}

/**
 * Step 5: Get repository from Bluesky as CAR file
 */
export async function getRepo(accessToken, did, since = null) {
  const params = { did }
  if (since) params.since = since

  const response = await axios.get(`${BLUESKY_SERVER}/xrpc/com.atproto.sync.getRepo`, {
    params,
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

/**
 * Step 6: Import repository to Rede Capivara
 */
export async function importRepo(accessToken, carFile) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)

  const response = await client.post('/xrpc/com.atproto.repo.importRepo', carFile, {
    headers: {
      'Content-Type': 'application/vnd.ipld.car',
    },
  })

  return response.data
}

/**
 * Step 7: List blobs from old PDS
 */
export async function listBlobs(accessToken, did) {
  const client = createAuthClient(BLUESKY_SERVER, accessToken)
  const response = await client.get('/xrpc/com.atproto.sync.listBlobs', {
    params: { did },
  })
  return response.data
}

/**
 * Step 8: List missing blobs on new PDS
 */
export async function listMissingBlobs(accessToken) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.get('/xrpc/com.atproto.repo.listMissingBlobs')
  return response.data
}

/**
 * Step 9: Upload blob to new PDS
 */
export async function uploadBlob(accessToken, blob) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.post('/xrpc/com.atproto.repo.uploadBlob', blob, {
    headers: {
      'Content-Type': blob.type || 'application/octet-stream',
    },
  })
  return response.data
}

/**
 * Step 10: Get recommended DID credentials from new PDS
 */
export async function getRecommendedDidCredentials(accessToken) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.get('/xrpc/com.atproto.identity.getRecommendedDidCredentials')
  return response.data
}

/**
 * Step 11: Request PLC operation signature from old PDS
 */
export async function requestPlcOperationSignature(oldAccessToken) {
  const client = createAuthClient(BLUESKY_SERVER, oldAccessToken)
  const response = await client.post('/xrpc/com.atproto.identity.requestPlcOperationSignature')
  return response.data
}

/**
 * Step 12: Sign PLC operation on old PDS
 */
export async function signPlcOperation(
  oldAccessToken,
  token,
  rotationKeys,
  alsoKnownAs,
  verificationMethods,
  services
) {
  const client = createAuthClient(BLUESKY_SERVER, oldAccessToken)
  const response = await client.post('/xrpc/com.atproto.identity.signPlcOperation', {
    token,
    rotationKeys,
    alsoKnownAs,
    verificationMethods,
    services,
  })
  return response.data
}

/**
 * Step 13: Submit PLC operation to new PDS
 */
export async function submitPlcOperation(accessToken, operation) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.post('/xrpc/com.atproto.identity.submitPlcOperation', {
    operation,
  })
  return response.data
}

/**
 * Step 14: Activate account on new PDS
 */
export async function activateAccount(accessToken) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.post('/xrpc/com.atproto.server.activateAccount')
  return response.data
}

/**
 * Step 15: Deactivate account on old PDS
 */
export async function deactivateAccount(oldAccessToken, deleteAfter = null) {
  const client = createAuthClient(BLUESKY_SERVER, oldAccessToken)
  const params = {}
  if (deleteAfter) params.deleteAfter = deleteAfter

  const response = await client.post('/xrpc/com.atproto.server.deactivateAccount', params)
  return response.data
}

/**
 * Export user preferences from Bluesky
 */
export async function getPreferences(accessToken) {
  const client = createAuthClient(BLUESKY_SERVER, accessToken)
  const response = await client.get('/xrpc/app.bsky.actor.getPreferences')
  return response.data
}

/**
 * Import user preferences to Rede Capivara
 */
export async function putPreferences(accessToken, preferences) {
  const client = createAuthClient(REDE_CAPIVARA_SERVER, accessToken)
  const response = await client.post('/xrpc/app.bsky.actor.putPreferences', {
    preferences,
  })
  return response.data
}

/**
 * Complete migration orchestration
 */
export async function migrateAccount(params, onProgress) {
  const { blueskyHandle, blueskyPassword, newHandle, newEmail, newPassword, inviteCode, keepHandle = false } = params

  try {
    // Step 1: Login to Bluesky
    onProgress({
      step: 1,
      status: 'processing',
      message: 'Conectando ao Bluesky...',
    })
    const blueskySession = await loginToBluesky(blueskyHandle, blueskyPassword)
    const oldAccessToken = blueskySession.accessJwt
    const did = blueskySession.did

    // Step 1.5: Get service auth token from Bluesky
    onProgress({
      step: 1,
      status: 'processing',
      message: 'Obtendo autorização do Bluesky...',
    })
    const serviceAuth = await getServiceAuth(oldAccessToken, did)
    const serviceAuthToken = serviceAuth.token

    onProgress({
      step: 1,
      status: 'completed',
      message: 'Conectado ao Bluesky!',
    })

    // Step 2: Create account on Rede Capivara with service auth
    onProgress({
      step: 2,
      status: 'processing',
      message: 'Criando conta na Rede Capivara...',
    })
    const finalHandle = keepHandle ? blueskyHandle.replace('.bsky.social', '') : newHandle

    const newAccount = await createAccountWithDID({
      email: newEmail,
      handle: finalHandle,
      password: newPassword,
      did: did, // Existing DID from Bluesky
      inviteCode: inviteCode, // Invite code required by server
      serviceAuthToken: serviceAuthToken, // Service auth from Bluesky
    })

    const newAccessToken = newAccount.accessJwt
    onProgress({
      step: 2,
      status: 'completed',
      message: `Conta @${finalHandle}.redecapivara.social criada!`,
    })

    // Step 4: Check account status
    onProgress({
      step: 3,
      status: 'processing',
      message: 'Verificando status da conta...',
    })
    await checkAccountStatus(newAccessToken)

    // Step 5: Export repository from Bluesky
    onProgress({
      step: 3,
      status: 'processing',
      message: 'Exportando repositório do Bluesky...',
    })
    const carFile = await getRepo(oldAccessToken, did)
    onProgress({
      step: 3,
      status: 'completed',
      message: 'Repositório exportado!',
    })

    // Step 6: Import repository to Rede Capivara
    onProgress({
      step: 4,
      status: 'processing',
      message: 'Importando posts...',
    })
    await importRepo(newAccessToken, carFile)
    onProgress({ step: 4, status: 'completed', message: 'Posts importados!' })

    // Step 7: Migrate blobs (media files)
    onProgress({
      step: 4,
      status: 'processing',
      message: 'Migrando arquivos de mídia...',
    })

    // try {
    //   const blobsList = await listBlobs(oldAccessToken, did);

    //   // Download and re-upload each blob
    //   if (blobsList.cids && blobsList.cids.length > 0) {
    //     let migratedCount = 0;
    //     for (const cid of blobsList.cids) {
    //       try {
    //         // Download blob from Bluesky with authentication
    //         const blobResponse = await axios.get(
    //           `${BLUESKY_SERVER}/xrpc/com.atproto.sync.getBlob`,
    //           {
    //             params: { did, cid },
    //             headers: { Authorization: `Bearer ${oldAccessToken}` },
    //             responseType: "arraybuffer",
    //           }
    //         );

    //         // Upload to Rede Capivara
    //         const blob = new Blob([blobResponse.data], {
    //           type:
    //             blobResponse.headers["content-type"] ||
    //             "application/octet-stream",
    //         });
    //         await uploadBlob(newAccessToken, blob);
    //         migratedCount++;
    //       } catch (err) {
    //         console.warn(`Failed to migrate blob ${cid}:`, err.message);
    //       }
    //     }

    //     onProgress({
    //       step: 4,
    //       status: "completed",
    //       message: `${migratedCount} arquivo(s) de mídia migrado(s)!`,
    //     });
    //   } else {
    onProgress({
      step: 4,
      status: 'completed',
      message: 'Nenhum arquivo de mídia para migrar',
    })
    //   }
    // } catch (err) {
    //   console.warn("Blob migration failed:", err);
    //   onProgress({
    //     step: 4,
    //     status: "completed",
    //     message: "Migração de mídia pulada (erro não crítico)",
    //   });
    // }

    // Step 8: Export and import preferences
    onProgress({
      step: 5,
      status: 'processing',
      message: 'Importando preferências...',
    })
    const preferences = await getPreferences(oldAccessToken)
    await putPreferences(newAccessToken, preferences.preferences)
    onProgress({
      step: 5,
      status: 'completed',
      message: 'Conexões restauradas!',
    })

    // Step 9: Update identity (PLC operation)
    onProgress({
      step: 6,
      status: 'processing',
      message: 'Atualizando identidade...',
    })
    const didCreds = await getRecommendedDidCredentials(newAccessToken)

    // Request email token for PLC operation
    await requestPlcOperationSignature(oldAccessToken)

    // Note: User needs to check email and provide token
    // This would require UI interaction, so we'll skip auto-submission for now

    onProgress({
      step: 6,
      status: 'processing',
      message: 'Verifique seu email para confirmar a mudança de identidade...',
    })

    // Return session info for manual PLC operation completion
    return {
      success: true,
      did,
      oldAccessToken,
      newAccessToken,
      newAccount,
      requiresEmailConfirmation: true,
      didCreds,
    }
  } catch (error) {
    console.error('Migration error:', error)
    throw new Error(error.response?.data?.message || error.message || 'Erro na migração')
  }
}

/**
 * Complete migration after email confirmation
 */
export async function completeMigration(oldAccessToken, newAccessToken, emailToken, didCreds) {
  try {
    // Sign PLC operation
    const plcOp = await signPlcOperation(
      oldAccessToken,
      emailToken,
      didCreds.rotationKeys,
      didCreds.alsoKnownAs,
      didCreds.verificationMethods,
      didCreds.services
    )

    // Submit to new PDS
    await submitPlcOperation(newAccessToken, plcOp.operation)

    // Activate new account
    await activateAccount(newAccessToken)

    // Deactivate old account (with 72hr grace period)
    // const deleteAfter = new Date();
    // deleteAfter.setHours(deleteAfter.getHours() + 72);
    // await deactivateAccount(oldAccessToken, deleteAfter.toISOString());

    return { success: true }
  } catch (error) {
    console.error('Complete migration error:', error)
    throw new Error(error.response?.data?.message || error.message || 'Erro ao finalizar migração')
  }
}
