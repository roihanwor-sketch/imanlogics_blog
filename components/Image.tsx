import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  if (!src) return null
  const isExternal =
    typeof src === 'string' &&
    (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))
  const finalSrc = isExternal ? src : `${basePath || ''}${src}`
  return <NextImage src={finalSrc} {...rest} />
}

export default Image
