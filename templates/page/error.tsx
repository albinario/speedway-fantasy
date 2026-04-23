'use client'

import { createErrorPage } from '@/components/ErrorFallback'

import { fetchFailed, metaData } from './[id]/constants'

export default createErrorPage(metaData.title, fetchFailed)
