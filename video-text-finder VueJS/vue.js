new Vue({
  el: '#app',
  data: {
    url: 'https://www.youtube.com/watch?v=klnvttPfOUM',
    kataKunci: '',
    daftarHasil: [],
    paginasi: {
      first: null,
      last: null,
      prev: null,
      next: null,
      total: 0,
      page: null
    }
  },
//   computed: {
//     jadikanString() {
//       return nilai => JSON.stringify(nilai, null, 2)
//     }
//   },
  watch: {
    kataKunci: pDebounce(async function tanganiKataKunci(kataKunci) {
      if (kataKunci && kataKunci.length >= 3) {
        await this.cari(kataKunci, this.url)
      } else {
        this.bersihkanHasilDanPaginasi()
      }
    }, 250)
  },
  methods: {
    async cari(kataKunci, url, paginasi) {
      try {
        const respon = await fetch(
          paginasi
            ? paginasi
            : `https://cari-teks-video-api.vercel.app/api/search?q=${kataKunci}&url=${encodeURIComponent(
                url
              )}`
        ).then(_ => (_.ok ? _.json() : []))

        this.daftarHasil = respon.data
        Object.keys(respon).forEach(key => {
          if (key !== 'data') {
            this.paginasi[key] = respon[key]
          }
        })
      } catch (error) {}
    },
    async navigasi(type) {
      if (!this.paginasi[type]) {
        return
      }
      await this.cari(this.kataKunci, this.url, this.paginasi[type])
    },
    bersihkan() {
      this.kataKunci = ''
      this.bersihkanHasilDanPaginasi()
    },
    bersihkanHasilDanPaginasi() {
      this.daftarHasil = []
      this.paginasi = {
        first: null,
        last: null,
        prev: null,
        next: null,
        total: 0,
        page: null
      }
    }
  }
})