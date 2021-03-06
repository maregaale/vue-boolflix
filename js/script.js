const app = new Vue (
  {
    el: "#root",
    data: {
      filmAndSeries: [],
      popularFilms: [],
      voteStars: [1, 2, 3, 4, 5],
      languages: ["en", "fr", "es", "de", "hi", "zh", "ja", "it", "ru", "ar", "ko", "he", "pt", "sv", "uk", "da", "fa"],
      baseUrl: "https://api.themoviedb.org/3/search/",
      popularUrl: "https://api.themoviedb.org/3/movie/popular",
      apiKey: "cd918788b3810512019e7d18b803e41d",
      lang: "it-IT",
      search: "",
      goLeft: "",
      goPopularLeft: "",
      displayIf: false,
      displayFilms: false,
      goLeftStart: 0,
      popularLeftStart: 0,
    },
    methods: {

      // funzione che mostra le frecce del carousel
      showArrows: function (reply) {

        this.displayIf = false;

        // mostro le frecce del carousel
        if (this.search != "" && reply.data.results.length > 4) {
          this.displayIf = true;
        }
      },

      // funzione che imposta il voto in 5 arrotondando per eccesso
      voteInFive: function (reply) {

        reply.data.results.forEach((item, i) => {
          item.vote_average = Math.ceil(item.vote_average / 2);
        });
      },

      // funzione che cerca film e serie tv
      searchFilm: function () {

        if (this.search != "") {

          // prima chiamata API per i film
          axios.get(this.baseUrl + "movie", {
            params: {
              api_key: this.apiKey,
              query: this.search,
              language: this.lang,
            }
          })
          .then((filmReply) => {

            this.filmAndSeries = filmReply.data.results;

            this.showArrows(filmReply);
            this.voteInFive(filmReply);

            // seconda chiamata API per le serie
            axios.get(this.baseUrl + "tv", {
              params: {
                api_key: this.apiKey,
                query: this.search,
                language: this.lang,
              }
            })
            .then((serieReply) => {

              // pusho le serie nell'array
              serieReply.data.results.forEach((item, i) => {
                this.filmAndSeries.push(item);
              });

              // mostro il contenitore dei film cercati
              this.displayFilms = true;

              this.showArrows(serieReply);
              this.voteInFive(serieReply);
            })

          });

        } else {
          // azzero l'array e tolgo le frecce
          this.filmAndSeries = [];
          this.displayIf = false;

          // tolgo il contenitore dei film cercati
          this.displayFilms = false;
        }

        // azzero il left dei film per centrare i film nelle nuove ricerche
        this.goLeftStart = 0;
        this.goLeft = "";
      },

      // funzione che sposta in avanti i film nel carousel
      goSlider: function () {

        if (this.goLeftStart > (-(this.filmAndSeries.length - 1) * 308)) {
          this.goLeftStart -= 308;
          this.goLeft = this.goLeftStart + 'px';
        }
      },

      // funzione che sposta indietro i film nel carousel
      returnSlider: function () {

        if (this.goLeftStart < 0) {
          this.goLeftStart += 308;
          this.goLeft = this.goLeftStart + 'px';
        }
      },

      // funzione che sposta in avanti i film popolari
      goPopularSlider: function () {

        if (this.popularLeftStart > (-(this.popularFilms.length - 1) * 308)) {
          this.popularLeftStart -= 308;
          this.goPopularLeft = this.popularLeftStart + 'px';
        }
      },

      // funzione che sposta indietro i film popolari
      returnPopularSlider: function () {

        if (this.popularLeftStart < 0) {
          this.popularLeftStart += 308;
          this.goPopularLeft = this.popularLeftStart + 'px';
        }
      },
    },

    // mostra al created i film popolari
    created: function () {

        axios.get(this.popularUrl, {
          params: {
            api_key: this.apiKey,
            language: this.lang,
          }
        })
        .then( (response) => {
          this.popularFilms = response.data.results;

          this.showArrows(response);
          this.voteInFive(response);
        });
    },
  }
);
