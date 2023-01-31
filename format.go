package main

import (
	"regexp"
	"strings"
)

func format(s string) string {
	s = comma(s)
	s = space(s)
	s = strings.Title(s)
	s = exeptions(s)
	return s
}

func exeptions(s string) string{
	re := regexp.MustCompile(`(Usa|Uk)`)
	for _, group := range re.FindAllStringSubmatch(s, -1) {
		s = strings.ReplaceAll(s, group[1], strings.ToUpper(string(group[1])))
	}
	return s
}

func comma(s string) string {
	re := regexp.MustCompile(`-`)
	sub := re.FindStringSubmatch(s)
	s = strings.ReplaceAll(s, sub[0], ", ")
	return s
}

func space(s string) string {
	re := regexp.MustCompile(`_`)
	for _, group := range re.FindAllStringSubmatch(s, -1) {
		s = strings.ReplaceAll(s, group[0], " ")
	}
	return s
}


