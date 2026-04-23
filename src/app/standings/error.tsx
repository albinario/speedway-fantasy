'use client'

import { createErrorPage } from '@/components/ErrorFallback'

import { fetchFailed, metaData } from './constants'

export default createErrorPage(metaData.title, fetchFailed)
