const app = new Vue (
  {
    el: "#root",
    data: {
      search: "",
      filmAndSeries: [],
      displayIf: false,
      goLeftStart: 0,
      goLeft: "",
      voteStars: [1, 2, 3, 4, 5],
      languages: ["en", "fr", "es", "de", "hi", "zh", "ja", "it", "ru", "ar", "ko", "he", "pt", "sv", "uk", "da", "fa"],
    },
    methods: {

      // funzione che mostra le frecce del carousel
      showArrowsAndVote: function (reply) {
        // mostro le frecce del carousel
        this.displayIf = false;

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
          axios.all([
            // prima chiamata API per i film
            axios.get("https://api.themoviedb.org/3/search/movie", {
              params: {
                api_key: "cd918788b3810512019e7d18b803e41d",
                query: this.search,
                language: "it-IT",
              }
            }),
            // seconda chiamata API per le serie
            axios.get("https://api.themoviedb.org/3/search/tv", {
              params: {
                api_key: "cd918788b3810512019e7d18b803e41d",
                query: this.search,
                language: "it-IT",
              }
            }),
          ])
          .then(axios.spread((filmReply, serieReply) => {
            // azione alla prima chiamata
            this.filmAndSeries = filmReply.data.results;

            this.showArrowsAndVote(filmReply);
            this.voteInFive(filmReply);

            // azione alla seconda chiamata
            serieReply.data.results.forEach((item, i) => {
              this.filmAndSeries.push(item);
            });

            this.showArrowsAndVote(serieReply);
            this.voteInFive(serieReply);
          }));

        } else {
          this.filmAndSeries = [];
          this.displayIf = false;
        }

        // azzero il left dei film per centrare i film nelle nuove ricerche
        this.goLeftStart = 0;
        this.goLeft = "";
      },

      // funzione che sposta in avanti i film nel carousel
      goSlider: function () {
        let filmSeriesFiltered = this.filmAndSeries.filter( (item) => {
            return item.poster_path != null;
        })
        if (this.goLeftStart > (-(filmSeriesFiltered.length - 4) * 300)) {
          this.goLeftStart -= 308;
          this.goLeft = this.goLeftStart + 'px';
        }
      },

      // funzione che sposta indietro i film nel carousel
      returnSlider: function () {
        let filmSeriesFiltered = this.filmAndSeries.filter( (item) => {
            return item.poster_path != null;
        })
        if (this.goLeftStart < 0) {
          this.goLeftStart += 308;
          this.goLeft = this.goLeftStart + 'px';
        }
      },
    },
  }
);
