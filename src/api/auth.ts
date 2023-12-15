import { Router } from 'packages/oak@v12.6.1/mod.ts'
import { generateToken } from '../jwt.ts'
import { authenticate, create } from '../models/user.ts'
import type { User } from 'types/mod.ts'

const auth = new Router()

auth.post('/register', async (ctx) => {
  const body = ctx.request.body()
  try {
    const user = await body.value as User
    const isRegister = await create(
      user.name,
      user.email,
      user.password,
    )
    if (isRegister.success) {
      ctx.response.body = isRegister
    } else {
      ctx.response.body = isRegister
    }
  } catch {
    ctx.response.body = {
      message: 'Error en la creación del usuario.',
      success: false,
    }
  }
})

auth.post('/login', async (ctx) => {
  const body = ctx.request.body()
  try {
    const user = await body.value as User
    const isAuthenticated = await authenticate(
      user.email,
      user.password,
    )
    if (isAuthenticated) {
      const token = generateToken(JSON.stringify(user.id))
      ctx.response.body = {
        message: 'Succesfully login 🐳',
        token,
      }
    } else {
      ctx.response.body = 'Invalid credentials'
      ctx.throw(401)
    }
  } catch (error) {
    ctx.response.body = {
      error: 'Internal server Error',
      message: error.message,
      type: error.cause,
    }
  }
})

export default auth
