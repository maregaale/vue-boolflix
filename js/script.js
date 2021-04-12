const app = new Vue (
  {
    el: "#root",
    data: {
      search: "",
      filmFiltered: [],
      displayIf: false,
      goLeftStart: 0,
      goLeft: "",
      voteStars: [1, 2, 3, 4, 5],
      languages: ["en", "fr", "es", "de", "hi", "zh", "ja", "it", "ru", "ar", "ko", "he", "pt", "sv", "uk", "da", "fa"],
    },
    methods: {
      searchFilm: function () {
        if (this.search != "") {
          axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {
              api_key: "cd918788b3810512019e7d18b803e41d",
              query: this.search,
              language: "it-IT",
            }
          })
          .then((reply) => {
            this.filmFiltered = reply.data.results;


            // mostro le frecce del carousel
            this.displayIf = false;

            if (this.search != "" && reply.data.results.length > 4) {
              this.displayIf = true;
            }

            // costruisco il voto in 5 dividendo e arrotondando per eccesso
            reply.data.results.forEach((item, i) => {
              item.vote_average = Math.ceil(item.vote_average / 2);
            });
          })
        } else {
          this.filmFiltered = [];
          this.displayIf = false;
        }

        // azzero il left dei film per centrare i film nelle nuove ricerche
        this.goLeftStart = 0;
        this.goLeft = "";

      },
      goSlider: function () {
        let filmDisplay = this.filmFiltered.filter( (item) => {
            return item.poster_path != null;
        })
        if (this.goLeftStart > (-(filmDisplay.length - 4) * 300)) {
          this.goLeftStart -= 308;
          this.goLeft = this.goLeftStart + 'px';
        }
      },
      returnSlider: function () {
        let filmDisplay = this.filmFiltered.filter( (item) => {
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
