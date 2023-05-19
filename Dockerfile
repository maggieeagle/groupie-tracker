FROM golang:1.17-alpine3.15

LABEL maintainer="@maggieeagle @AntonL"
WORKDIR /app     

COPY . .

RUN go build -o groupie-tracker .
CMD [ "/app/groupie-tracker" ]