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
            restaurants: [{
                    nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'Sun City Café',
                    cuisine: 'Américaine'
                }
            ],
            nbRestaurants: 0,
            nbPagesDeResultats:0,
            nom: '',
            cuisine: '',
            page: 0,
            pagesize: 10,
            nomRecherche: "",
            searchItem: '',
            items: items,
            filteredItems: [],
            paginatedItems: [],
            selectedItems: [],
            pagination: {
            range: 5,
            currentPage: 1,
            itemPerPage: 8,
            items: [],
            filteredItems: [],
            }
        },

        
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },

        
        methods: {
                 getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page +
                    "&pagesize=" + this.pagesize +
                    "&name=" + this.nomRecherche;

                // ARROW FUNCTIONS PRESERVENT LE THIS !!!
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
            updateRestaurant(event){
              try {
                    this.restaurant.updateRestaurant;

                    fetch(`${url}/restaurants/${_id}`, {
                        method: "PUT",
                        body: new FormData(e.target)
                    });
                    this.getRestaurantsFromServer(this.page);
                    this.restaurantHasFound = false;
                    this.restaurant.updateRestaurant = Restaurant;
                    
                    this.alert({
                        title: 'Succès',
                        message: 'Restaurant modifié !',
                        type: 'success'
                    });

                } catch (err) {
                    this.alert.error({
                        title: 'Erreur',
                        message: "Echec de la modification du restaurant !",
                    });
                    console.error('[ERROR] updateRestaurant : ', err)
                }
            },   
            
            supprimerRestaurant(index) {
                try{
                this.restaurants.splice(index, 1);

                fetch(`${url}/restaurants/${_id}`, {
                    method: "DELETE",
                    body: new FormData(event.target)
                });
                this.getRestaurantsFromServer(this.page);
                this.restaurantHasFound = false;
                this.restaurant.supprimerRestaurant = Restaurant;
               
                }catch (err) {
                    this.alert.error({
                        title: 'Erreur',
                        message: "Echec de la suppression du restaurant !",
                    });
                    console.error('[ERROR] Restaurant : ', err)
                }
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // On recupère le formulaire
                let form = event.target;

                // On recupere les données du formulaire
                let dataFormulaire = new FormData(form);

               // On envoie une requête POST au serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                    method:"POST",
                    body: dataFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((responseJS) => {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(responseJS.msg);
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                // On remet les champs du formulaire à zéro
                this.nom = "";
                this.cuisine = "";
            },
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'lightCyan';
            },

        

                
    

            
        }
    })
}