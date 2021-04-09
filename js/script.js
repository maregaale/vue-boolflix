const app = new Vue (
  {
    el: "#root",
    data: {
      search: "",
    },
    methods: {
      searchFilm: function () {
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: "cd918788b3810512019e7d18b803e41d",
            query: this.search,
            language: "it-IT",
          }
        })
          .then(function (reply) {
            console.log(reply.data);
          })
      }
    },
  }
);
