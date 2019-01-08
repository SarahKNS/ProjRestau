window.onload = init;

let items = []
for(var i=0; i<20000; i++){
  items.push({
    key: i+1,
    ssn: chance.ssn(),  // SSN as person ID
    name: chance.name(),
    email: chance.email(),
    address: chance.address(),
    phone: chance.phone(),
    selected: false
  })
}

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [
                {
                    name: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    name: 'Sun City Café',
                    cuisine: 'Américaine'
                }
            ],
            name: '',
            cuisine: '',
            modify: false,
            count: 0,
            page: 0,
            nbPerPage: 5,
            //modification
            nametomodify: '',
            cuisinetomodify: ''
        },
        mounted() {
            console.log("hello");
            this.getRestaurantsFromServeur();
        },
        methods: {
            getRestaurantsFromServeur() {
                let url = "http://localhost:8080/api/restaurants?page=" + this.page + 
                "&pagesize=" + this.nbPerPage + 
                "&name="+ this.name;

                //console.log("getRestaurantsFromServeur : "+url)
                
                fetch(url)
                .then((responseJSON) => {
                    responseJSON.json()
                        .then((responseJS) => {
                            // Maintenant res est un vrai objet JavaScript
                            console.log("restaurants récupérés");
                            this.restaurants = responseJS.data;
                            this.nbRestaurants = responseJS.count;
                            this.nbPagesDeResultats = Math.ceil(this.nbRestaurants/this.pagesize);
                        });
                })
                .catch(function (err) {
                    console.log(err);
                });
        },


            pageNext() {
                this.page++;
                this.getRestaurantsFromServeur();
            },
            pagePrev() {
                this.page--;
                this.getRestaurantsFromServeur();
            },
            supprimerRestaurant(index) {
                this.restaurants.splice(index, 1);
            },
            ajouterRestaurant(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                let form = document.getElementsByName("formulaireAjout");

                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(form);
                console.log(form);

                let url = "http://127.0.0.1:8080/api/restaurants";

                fetch(url, {
                    method: "POST",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                // Maintenant res est un vrai objet JavaScript
                                //afficheReponsePOST(res);
                                console.log(res);
                                this.getRestaurantsFromServeur();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            getName(restaurants) {
                return restaurants.name;
            },
            getId(restaurants) {
                return restaurants.restaurant_id;
            },
            modifierRestaurant(index){
                console.log("modifierRestaurant "+index);
                document.getElementById("tohide").setAttribute('style','display:block;');
                this.fillDataToModify(index);
            },
            fillDataToModify(index){
                console.log("");
                var id = this.getId(this.restaurants[index]);
                document.getElementsByName("idToModify")[0].innerHTML = id;

                var name = this.restaurants[index].name;
                var cuisine = this.restaurants[index].cuisine;

                this.nametomodify = name;
                this.cuisinetomodify = cuisine;
            },
            modifyRestaurant(index) {
                console.log("modifyRestaurant"+index);
                var id = this.getId(this.restaurants[index]);
                document.getElementsByName("idToModify")[0].innerHTML = id;

                var name = this.restaurants[index].name;
                var cuisine = this.restaurants[index].cuisine;

                this.nametomodify = name;
                this.cuisinetomodify = cuisine;
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                let form = document.getElementsByName("formulaireAjout");

                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(form);
                console.log(form);

                let url = "http://127.0.0.1:8080/api/restaurants";

                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                // Maintenant res est un vrai objet JavaScript
                                //afficheReponsePOST(res);
                                console.log(res);
                                this.getRestaurantsFromServeur();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        }
    })
}