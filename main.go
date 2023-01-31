package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"regexp"
	"sort"
	"strconv"
)

type RootJSONdata struct {
	Artists string `json:"artists"`
	// Locations string `json:"locations"`
	// Dates     string `json:"dates"`
	Relation string `json:"relation"`
}

type Artist struct {
	Id           int      `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	//Locations    Locations
	//ConcertDates []string
	Relation DatesLocations
}

/* type LocationsObject struct {
	Index []Locations `json:"index"`
}

type Locations struct {
	Id        int      `json:"id"`
	Locations []string `json:"locations"`
}

type DatesObject struct {
	Index []Dates `json:"index"`
}

type Dates struct {
	Id    int      `json:"id"`
	Dates []string `json:"dates"`
}*/

type RelationObject struct {
	Index []Relations `json:"index"`
}

type Relations struct {
	Id             int
	DatesLocations DatesLocations `json:"datesLocations"`
}

type DatesLocations map[string][]string

var root RootJSONdata
var artists []Artist

// var locations LocationsObject
// var dates DatesObject
var relations RelationObject

type Data struct {
	Artists               []Artist
	MinCreationDate       int
	MaxCreationDate       int
	MinFilterCreationDate int
	MaxFilterCreationDate int
	MinAlbumDate          int
	MaxAlbumDate          int
	MinFilterAlbumDate    int
	MaxFilterAlbumDate    int
	Members               []int
	FilterMembers         []int
}

func (mainData *Data) setData() {
	mainData.Artists = artists
	if len(artists) > 0 {
		minCreation := artists[0].CreationDate
		maxCreation := artists[0].CreationDate
		minAlbum := getYear(artists[0].FirstAlbum)
		maxAlbum := getYear(artists[0].FirstAlbum)
		for _, artist := range artists {
			if artist.CreationDate > maxCreation {
				maxCreation = artist.CreationDate
			}
			if artist.CreationDate < minCreation {
				minCreation = artist.CreationDate
			}
			y := getYear(artist.FirstAlbum)
			if y > maxAlbum {
				maxAlbum = y
			}
			if y < minAlbum {
				minAlbum = y
			}
			if !find(len(artist.Members), mainData.Members) {
				mainData.Members = append(mainData.Members, len(artist.Members))
			}
		}
		mainData.MinCreationDate = minCreation
		mainData.MaxCreationDate = maxCreation
		mainData.MinAlbumDate = minAlbum
		mainData.MaxAlbumDate = maxAlbum
	} else {
		mainData.MinCreationDate = 1950
		mainData.MaxCreationDate = 2023
		mainData.MinAlbumDate = 1950
		mainData.MaxAlbumDate = 2023
	}
	mainData.MinFilterCreationDate = mainData.MinCreationDate
	mainData.MaxFilterCreationDate = mainData.MaxCreationDate
	mainData.MinFilterAlbumDate = mainData.MinAlbumDate
	mainData.MaxFilterAlbumDate = mainData.MaxAlbumDate
	sort.Ints(mainData.Members)
}

func getYear(date string) int {
	r := regexp.MustCompile(`\d{4}`)
	year, _ := strconv.Atoi(r.FindStringSubmatch(date)[0])
	return year
}

func mainPage(w http.ResponseWriter, r *http.Request) {
	var mainData Data
	mainData.setData()
	tmpl, err := template.ParseFiles("static/templates/index.html")
	if check404(err, w, r, "/") {
		page404(w, r)
	} else {
		tmpl.Execute(w, mainData)
	}
}

func page404(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("static/templates/404.html")
	if err != nil {
		fmt.Fprint(w, "404")
	} else {
		tmpl.Execute(w, nil)
	}
}

func filters(w http.ResponseWriter, r *http.Request) {
	var mainData Data
	mainData.setData()

	err := r.ParseForm()
	if err != nil {
		check400(w, r)
		mainPageAfterFilters(w, r, mainData)
		return
	}
	// here should be an additional check that form input is numbers
	minCreation := r.Form["creation-min-date"]
	maxCreation := r.Form["creation-max-date"]
	minAlbum := r.Form["album-min-date"]
	maxAlbum := r.Form["album-max-date"]
	members, err := Atoi(r.Form["members"])
	if err != nil {
		check400(w, r)
		members = mainData.Members
	}
	if len(minCreation) > 0 && len(maxCreation) > 0 {
		minFilterCreationDate, err := strconv.Atoi(minCreation[0])
		if err != nil {
			check400(w, r)
			minFilterCreationDate = mainData.MinCreationDate
		}
		maxFilterCreationDate, err := strconv.Atoi(maxCreation[0])
		if err != nil {
			check400(w, r)
			maxFilterCreationDate = mainData.MaxCreationDate
		}
		minFilterAlbumDate, err := strconv.Atoi(minAlbum[0])
		if err != nil {
			check400(w, r)
			minFilterAlbumDate = mainData.MinAlbumDate
		}
		maxFilterAlbumDate, err := strconv.Atoi(maxAlbum[0])
		if err != nil {
			check400(w, r)
			maxFilterAlbumDate = mainData.MaxAlbumDate
		}
		var filterArtists []Artist
		for _, artist := range artists {
			y := getYear(artist.FirstAlbum)
			if artist.CreationDate >= minFilterCreationDate && artist.CreationDate <= maxFilterCreationDate &&
				y >= minFilterAlbumDate && y <= maxFilterAlbumDate && (find(len(artist.Members), members) || len(members) == 0) {
				filterArtists = append(filterArtists, artist)
			}
		}
		mainData.Artists = filterArtists
		mainData.MinFilterCreationDate = minFilterCreationDate
		mainData.MaxFilterCreationDate = maxFilterCreationDate
		mainData.MinFilterAlbumDate = minFilterAlbumDate
		mainData.MaxFilterAlbumDate = maxFilterAlbumDate
		mainData.FilterMembers = members
	}
	mainPageAfterFilters(w, r, mainData)
}

func Atoi(a []string) ([]int, error) {
	var output []int
	for _, s := range a {
		i, err := strconv.Atoi(s)
		if err != nil {
			return nil, err
		}
		output = append(output, i)
	}
	return output, nil
}

func find(value int, arr []int) bool {
	for _, s := range arr {
		if value == s {
			return true
		}
	}
	return false
}

func mainPageAfterFilters(w http.ResponseWriter, r *http.Request, mainData Data) {
	tmpl, err := template.ParseFiles("static/templates/index.html")
	if check404(err, w, r, "/filters") {
		page404(w, r)
	} else {
		tmpl.Execute(w, mainData)
	}
}

func main() {
	parseJSON()
	// client := http.Client{Timeout: time.Duration(1) * time.Second}
	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	go mux.HandleFunc("/", mainPage)
	go mux.HandleFunc("/filters", filters)

	fmt.Println("\nStarting server at http://127.0.0.1:8080/")
	fmt.Println("Quit the server with CONTROL-C.")
	err := http.ListenAndServe(":8080", mux)
	check500(err, "Cannot start server")
}

func getURLdata(link string) []byte {
	response, err := http.Get(link)
	check500(err, "Cannot reach API")

	// close response body when finish
	defer response.Body.Close()
	// read response body
	body, err := ioutil.ReadAll(response.Body)
	check500(err, "Cannot read response body")

	return body
}

func parseJSON() {
	parseRoot()
	parseArtists()
	parseRelation()

	/*fmt.Println("Parsing locations JSON...")
	data = getURLdata(root.Locations)
	if data != nil {
		err := json.Unmarshal(data, &locations)
		check(err)
	}
	fmt.Println(locations_check())

	fmt.Println("Parsing dates JSON...")
	data = getURLdata(root.Dates)
	if data != nil {
		err := json.Unmarshal(data, &dates)
		check(err)
	}
	fmt.Println(dates_check())*/

	for i := 0; i < len(artists); i++ {
		artists[i].Relation = findRelation(artists[i].Id)
	}
}

func parseRoot() {
	fmt.Println("Parsing root JSON...")
	data := getURLdata("https://groupietrackers.herokuapp.com/api")
	if data != nil {
		err := json.Unmarshal(data, &root)
		check500(err, "Cannot unmarshal root JSON data")
	}
	fmt.Println(root_check())
}

func parseArtists() {
	fmt.Println("Parsing artists JSON...")
	data := getURLdata(root.Artists)
	if data != nil {
		err := json.Unmarshal(data, &artists)
		check500(err, "Cannot unmarshal artists JSON data")
	}
	fmt.Println(artists_check())
}

func parseRelation() {
	fmt.Println("Parsing relation JSON...")
	data := getURLdata(root.Relation)
	if data != nil {
		err := json.Unmarshal(data, &relations)
		check500(err, "Cannot unmarshal relations JSON data")
	}
	fmt.Println(relation_check())
}

func findRelation(id int) DatesLocations {
	for i := 0; i < len(relations.Index); i++ {
		relation := relations.Index[i]
		if relation.Id == id {
			dl := make(DatesLocations)
			for j := range relation.DatesLocations {
				dates := relations.Index[i].DatesLocations[j]
				dl[format(j)] = dates
			}
			return dl
		}
	}
	return nil
}
