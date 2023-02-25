let map, searchManager, locations, id;

// modals.forEach(modal => {
    // locations = modals[0].querySelectorAll('.location')

    // id = '#map' + parseInt(modals[0].id.match(/\d+/))
    // console.log("mapid", id)
// })

function GetMap() {
    openModalButtons.forEach(card => {
        card.addEventListener('click', () => {
            id = parseInt(card.id.match(/\d+/))
            modal = document.getElementById('modal' + id)
            locations = modal.querySelectorAll('.location')
            // console.log("locations", locations)

            map = new Microsoft.Maps.Map('#map' + id, {
                zoom: 0,
                credentials: 'Aooun2Dx43_D3XHPH8iOzW7qwXdZBujQgsv1jFxGIBCvE42kaugqykAz7ntzWXES'
            });

            locations.forEach(l => {
                geocodeQuery(l.innerHTML)
            })
        })
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function geocodeQuery(query) {
    //If search manager is not defined, load the search module.
    if (!searchManager) {
        //Create an instance of the search manager and call the geocodeQuery function again.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            geocodeQuery(query);
        });
    } else {
        var searchRequest = {
            where: query,
            callback: function (r) {
                //Add the first result to the map and zoom into it.
                if (r && r.results && r.results.length > 0) {
                    var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                    map.entities.push(pin);

                    // map.setView({ bounds: r.results[0].bestView });
                }
            },
            errorCallback: function (e) {
                //If there is an error, alert the user about it.
                // alert("No results found.");
                console.log("error", e)
            }
        };

        //Make the geocode request.
        searchManager.geocode(searchRequest);
    }
}

//Pushpin click event
// function pushpinClicked(e) {
//     if (e.target.metadata) {
//         //Set information of clicked Pushpin
//         infobox.setOptions({
//             location: e.target.getLocation(),
//             title: e.target.metadata.title,
//             description: e.target.metadata.description,
//             visible: true
//         });
//     }
// }