interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'ImanLogics Autonomous Editorial Engine',
    description: `Arsitektur agen otonom dan pipeline editorial AI cerdas dengan sistem verifikasi 15 Hard Gates, grounding semantik VLM, dan riset lintas-bahasa untuk jurnalisme teknologi serta logika epistemologis.`,
    imgSrc: '/static/images/logo.png',
    href: 'https://imanlogics.web.id/products/',
  },
  {
    title: 'Zaadul Khotib Ecosystem',
    description: `Platform asisten persiapan khutbah dan kajian Islam terpadu yang memadukan khazanah kitab klasik dengan kecerdasan komputasi modern untuk membekali para dai dan pencari ilmu.`,
    imgSrc: '/static/images/logo.png',
    href: 'https://imanlogics.web.id/portfolio/',
  },
]

export default projectsData
