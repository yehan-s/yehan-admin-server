import { Request } from 'express'
import * as useragent from 'useragent'
import IP2Region from 'ip2region'

// 获取ip
export const getIp = (req: Request) => {
  const ips =
    (req.headers['x-forwarded-for'] as string) ||
    (req.headers['X-Real-IP'] as string) ||
    (req.ip.replace('::ffff:', '') as string).replace(':ffff:', '')
  return ips.split(',')?.[0]
}

// 根据ip获取地址
export const getAdressByIp = (ip: string): string => {
  if (!ip) return ''

  const query = new IP2Region()
  const res = query.search(ip)
  return [res.province, res.city].join(' ')
}

// 获取客户端信息 user-agent
export const getUserAgent = (req: Request): useragent.Agent => {
  return useragent.parse(req.headers['user-agent'] as string)
}

// 获取不带全局前缀的url
export const getExcludeGlobalPrefixUrl = (globalFix: string, url: string) => {
  if (url.startsWith(globalFix)) {
    return url.substring(globalFix.length)
  }

  return url
}
