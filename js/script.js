const app = new Vue (
  {
    el: "#root",
    data: {
      search: "",
      filmFiltered: [],
      displayIf: false,
      goLeftStart: 0,
      goLeft: "",
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
          })
        } else {
          this.filmFiltered = [];
          this.displayIf = false;
        }

        // azzero il left dei film per centrare i film nelle nuove ricerche
        this.goLeft = "";

      },
      goSlider: function () {
        let filmDisplay = this.filmFiltered.filter( (item) => {
            return item.poster_path != null;
        })
        if (this.goLeftStart > (-(filmDisplay.length -1) * 300)) {
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
