import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
const chatBaseUrl = "172.17.3.118:5000";

const toFormData = (data) => {
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
    // console.log(property + ": " + data.property);
  }
  return formData;
};
const ageProducer = () => {
  let ages = [];
  for (let i = 12; i <= 80; i++) {
    ages.push(i);
  }
  return ages;
};

const citiesList = [
  { id: 1, name: "Alborz" },
  { id: 2, name: "Ardabil" },
  { id: 3, name: "Bushehr" },
  { id: 4, name: "Chaharmahal and Bakhtiari" },
  { id: 5, name: "East Azerbaijan" },
  { id: 6, name: "Isfahan" },
  { id: 7, name: "Fars" },
  { id: 8, name: "Gilan" },
  { id: 9, name: "Golestan" },
  { id: 10, name: "Hamadan" },
  { id: 11, name: "Hormozgan" },
  { id: 12, name: "Ilam" },
  { id: 13, name: "Kerman" },
  { id: 14, name: "Kermanshah" },
  { id: 15, name: "Khuzestan" },
  { id: 16, name: "Kohgiluyeh and Boyer-Ahmad" },
  { id: 17, name: "Kurdistan" },
  { id: 18, name: "Lorestan" },
  { id: 19, name: "Markazi" },
  { id: 20, name: "Mazandaran" },
  { id: 21, name: "North Khorasan" },
  { id: 22, name: "Qazvin" },
  { id: 23, name: "Qom" },
  { id: 24, name: "Razavi Khorasan" },
  { id: 25, name: "Semnan" },
  { id: 26, name: "Sistan and Baluchestan" },
  { id: 27, name: "South Khorasan" },
  { id: 28, name: "Tehran" },
  { id: 29, name: "West Azerbaijan" },
  { id: 30, name: "Yazd" },
  { id: 31, name: "Zanjan" },
];

export default { baseUrl, chatBaseUrl, toFormData, ageProducer, citiesList };
