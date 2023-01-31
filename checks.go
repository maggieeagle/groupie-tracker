package main

import (
	"fmt"
	"log"
	"net/http"
	"reflect"
	"time"
)

// func check(e error) {
// 	if e != nil {
// 		fmt.Println(e)
// 	}
// }

func check500(e error, s string) {
	if e != nil {
		fmt.Println(s)
		fmt.Println(e)
		log.Fatal("500 Internal Server Error")
	}
}

func check404(e error, w http.ResponseWriter, r *http.Request, s string) bool {
	if e != nil || r.URL.Path != s {
		w.WriteHeader(http.StatusNotFound)
		Log("404 Not Found")

		return true
	}
	return false
}

func check400(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	Log("400 Bad Request")
}

func Log(s string) {
	dt := time.Now()
	fmt.Println(dt.Format("01/02/2006 15:04:05"), s)
}

const (
	ColorRed   string = "\u001b[31m"
	ColorReset string = "\u001b[0m"
)

func printDanger(s string) {
	fmt.Println(ColorRed, s, ColorReset)
}

func printDanger2(s string, i int) {
	fmt.Println(ColorRed, s, i, ColorReset)
}

func root_check() string {
	OK := true
	empty := 0
	if root.Artists == "" {
		printDanger("Cannot parse artists")
		OK = false
		empty++
	}
	/*if root.Locations == "" {
		printDanger("Cannot parse locations")
		OK = false
		empty++
	}
	if root.Dates == "" {
		printDanger("Cannot parse dates")
		OK = false
		empty++
	}*/
	if root.Relation == "" {
		printDanger("Cannot parse relation")
		OK = false
		empty++
	}
	if empty == reflect.ValueOf(root).NumField() {
		return "parsing finished, data have not been found"
	}
	if OK {
		return "root JSON parsed successfully"
	}
	return "parsing finished, some data have not been found"
}

func artists_check() string {
	if len(artists) == 0 { // haven't receive any data
		return "parsing finished, data have not been found"
	}
	OK := true
	for i := 0; i < len(artists); i++ {
		artist := artists[i]
		if artist.Id == 0 {
			printDanger("Cannot parse id")
			OK = false
		}
		if artist.Image == "" {
			printDanger2("Cannot parse image of artist with id", artist.Id)
			OK = false
		}
		if artist.Name == "" {
			printDanger2("Cannot parse name of artist with id ", artist.Id)
			OK = false
		}
		if artist.Members == nil {
			printDanger2("Cannot parse members of artist with id ", artist.Id)
			OK = false
		}
		if artist.CreationDate == 0 {
			printDanger2("Cannot parse creation date of artist with id ", artist.Id)
			OK = false
		}
		if artist.FirstAlbum == "" {
			printDanger2("Cannot parse first album of artist with id ", artist.Id)
			OK = false
		}
	}
	if OK {
		return "artists JSON parsed successfully"
	}
	return "parsing finished, some data have not been found"
}

/*func locations_check() string {
	location_list := locations.Index
	if len(location_list) == 0 { // haven't receive any data
		return "parsing finished, data have not been found"
	}
	OK := true
	for i := 0; i < len(location_list); i++ {
		location := location_list[i]
		if location.Id == 0 {
			printDanger("Cannot parse id")
			OK = false
		}
		if location_list == nil {
			printDanger2("Cannot parse locations of srtist with id", location.Id)
			OK = false
		}
	}
	if OK {
		return "locations JSON parsed successfully"
	}
	return "parsing finished, some data have not been found"
}

func dates_check() string {
	date_list := dates.Index
	if len(date_list) == 0 { // haven't receive any data
		return "parsing finished, data have not been found"
	}
	OK := true
	for i := 0; i < len(date_list); i++ {
		date := date_list[i]
		if date.Id == 0 {
			printDanger("Cannot parse id")
			OK = false
		}
		if date_list == nil {
			printDanger2("Cannot parse dates of artist with id", date.Id)
			OK = false
		}
	}
	if OK {
		return "dates JSON parsed successfully"
	}
	return "parsing finished, some data have not been found"
}*/

func relation_check() string {
	relation_list := relations.Index
	if len(relation_list) == 0 { // haven't receive any data
		return "parsing finished, data have not been found"
	}
	OK := true
	for i := 0; i < len(relation_list); i++ {
		list := relation_list[i]
		if list.Id == 0 {
			printDanger("Cannot parse id")
			OK = false
		}
		if list.DatesLocations == nil {
			printDanger2("Cannot parse datesLocations of artist with id", list.Id)
			OK = false
		}
	}
	if OK {
		return "relation JSON parsed successfully"
	}
	return "parsing finished, some data have not been found"
}
