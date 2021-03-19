const inputDefinitions = () => {

return [
    [{
    "id": "areaType",
    "title": "areaType",
    "type": "select",
    "placeHolderText": "Valitse",    
    "values": [
        {
        "id": "KAAVOITUSALUE",
        "title": "KAAVOITUSALUE"
        },
        {
        "id": "KASITTELYPAIKKA",
        "title": "KASITTELYPAIKKA"
        },
        {
        "id": "LOPPUSIJOITUSPAIKKA",
        "title": "LOPPUSIJOITUSPAIKKA"
        },
        {
        "id": "MAANOTTOALUE",
        "title": "MAANOTTOALUE"
        },
        {
        "id": "PIMA_ALUE",
        "title": "PIMA_ALUE"
        },
        {
        "id": "SUUNNITTELUALUE",
        "title": "SUUNNITTELUALUE"
        },
        {
        "id": "TYOMAA",
        "title": "TYOMAA"
        },
        {
        "id": "VALIVARASTO",
        "title": "VALIVARASTO"
        }
    ]
    },
    {
    "id": "phase",
    "title": "phase",
    "type": "select",
    "placeHolderText": "Valitse",    
    "values": [
        {
        "id": "ASEMAKAAVOITUS",
        "title": "ASEMAKAAVOITUS"
        },
        {
        "id": "EI_RELEVANTTI_TIETO",
        "title": "EI_RELEVANTTI_TIETO"
        },
        {
          "id": "ESIRAKENTAMINEN",
          "title": "ESIRAKENTAMINEN"
        },
        {
          "id": "ESI_JA_YLEISSUUNNITTELU",
          "title": "ESI_JA_YLEISSUUNNITTELU"
        },
        {
          "id": "KATU_JA_PUISTOSUUNNITTELU",
          "title": "KATU_JA_PUISTOSUUNNITTELU"
        },
        {
          "id": "RAKENNUSSUUNNITTELU",
          "title": "RAKENNUSSUUNNITTELU"
        },
        {
          "id": "RAKENTAMINEN",
          "title": "RAKENTAMINEN"
        },
        {
        "id": "YLEISKAAVOITUS",
        "title": "YLEISKAAVOITUS"
        }
    ]
    }],
   [ {
    "id": "landMassState",
    "title": "landMassState",
    "type": "select",
    "placeHolderText": "Valitse",
    "values": [
        {
        "id": "YLIJAAMA",
        "title": "YLIJAAMA"
        },
        {
          "id": "YLIJAAMA_KAIVETTAVA",
          "title": "YLIJAAMA_KAIVETTAVA"
        },
        {
        "id": "ALIJAAMA",
        "title": "ALIJAAMA"
        },
        {
        "id": "ALIJAAMA_TARVITTAVA",
        "title": "ALIJAAMA_TARVITTAVA"
        }
    ]
    },
    {
    "id": "landMassGroup",
    "title": "landMassGroup",
    "type": "select",
    "placeHolderText": "Valitse",
    "values": [
        {
        "id": "UUSIOMATERIAALIT",
        "title": "UUSIOMATERIAALIT"
        },
        {
        "id": "ELOPERÄISET_MAALAJIT",
        "title": "ELOPERÄISET_MAALAJIT"
        },
        {
        "id": "HIENORAKEISET_MAALAJIT",
        "title": "HIENORAKEISET_MAALAJIT"
        },
        {
        "id": "KARKEARAKEISET_MAALAJIT",
        "title": "KARKEARAKEISET_MAALAJIT"
        },
        {
        "id": "MOREENIMAALAJIT",
        "title": "MOREENIMAALAJIT"
        }
    ]
    },
    {
    "id": "landMassType",
    "title": "landMassType",
    "type": "select",
    "placeHolderText": "Valitse",
      "values": [
        {
          "id": "ASFALTTIMURSKE_ROUHE",
          "title": "ASFALTTIMURSKE_ROUHE"
        },
        {
          "id": "BETONIMURSKE",
          "title": "BETONIMURSKE"
        },
        {
          "id": "HIEKKA",
          "title": "HIEKKA"
        },
        {
          "id": "HIEKKAMOREENI",
          "title": "HIEKKAMOREENI"
        },
        {
          "id": "KALKKI",
          "title": "KALKKI"
        }, 
        {
          "id": "KEVYTBETONI_JA_KEVYTSORA_JATTEET",
          "title": "KEVYTBETONI_JA_KEVYTSORA_JATTEET"
        },
        {
          "id": "KIVI",
          "title": "KIVI"
        },
        {
          "id": "LIEJU",
          "title": "LIEJU"
        },
        {
          "id": "LOHKARE",
          "title": "LOHKARE"
        },
        {
          "id": "LOUHE",
          "title": "LOUHE"
        },
        {
          "id": "RENGASROUHE",
          "title": "RENGASROUHE"
        },
        {
          "id": "SAVI",
          "title": "SAVI"
        },
        {
          "id": "SILTTI",
          "title": "SILTTI"
        },
        {
          "id": "SILTTIMOREENI",
          "title": "SILTTIMOREENI"
        },
        {
          "id": "SORA",
          "title": "SORA"
        },
        {
          "id": "SORAMOREENI",
          "title": "SORAMOREENI"
        },
        {
          "id": "TIILIMURSKE",
          "title": "TIILIMURSKE"
        },
        {
          "id": "TUHJK_JA_KUONA",
          "title": "TUHJK_JA_KUONA"
        },
        {
          "id": "TURVE",
          "title": "TURVE"
        },
        {
          "id": "TAYTTOMAA",
          "title": "TAYTTOMAA"
        },
        {
          "id": "VALIMOHIEKKA",
          "title": "valimohiekka"
        }
      ]
    },
    {
      "id": "amountTotal",
      "title": "amountTotal",
      "type": "number"
    }],    
   [ {
    "id": "validityClassGroup",
    "title": "validityClassGroup",
    "type": "select",
    "placeHolderText": "Valitse",
        "values": [
        {
            "id": "HUONO",
            "title": "HUONO"
        },
        {
            "id": "KESKI",
            "title": "KESKI"
        },
        {
            "id": "HYVÄ",
            "title": "HYVÄ"
        }
        ]
    },
    {
    "id": "validityClass",
    "title": "validityClass",
    "type": "select",
    "placeHolderText": "Valitse",
      "values": [
        {
          "id": "H1",
          "title": "H1"
        },
        {
          "id": "H2",
          "title": "H2"
        },
        {
          "id": "H3",
          "title": "H3"
        },
        {
          "id": "H4",
          "title": "H4"
        },
        {
          "id": "S1",
          "title": "S1"
        },
        {
          "id": "S2",
          "title": "S2"
        },
        {
          "id": "S3",
          "title": "S3"
        },
        {
          "id": "S4",
          "title": "S4"
        },
        {
          "id": "TV",
          "title": "TV"
        },
        {
          "id": "U1",
          "title": "U1"
        },
        {
          "id": "U2",
          "title": "U2"
        },
        {
          "id": "U3",
          "title": "U3"
        },
        {
          "id": "U4",
          "title": "U4"
        }
      ]
    },
    {
    "id": "decay",
    "title": "decay",
    "type": "select",
    "placeHolderText": "Valitse",
        "values": [
        {
            "id": "PILAANTUMATON_MAA",
            "title": "PILAANTUMATON_MAA"
        },
        {
            "id": "PILAANTUNUT_MAA_ALEMMAN_OHJEARVON_YLITTÄMÄ",
            "title": "PILAANTUNUT_MAA_ALEMMAN_OHJEARVON_YLITTÄMÄ"
        },
        {
            "id": "PILAANTUNUT_MAA_YLEMMÄN_OHJEARVON_YLITTÄMÄ",
            "title": "PILAANTUNUT_MAA_YLEMMÄN_OHJEARVON_YLITTÄMÄ"
        },
        {
            "id": "VAARALLINEN_JATE_JATELAINSAADANTO",
            "title": "VAARALLINEN_JATE_JATELAINSAADANTO"
        }
        ]
    }],
    [{
        "id": "plannedBeginDate",
        "title": "plannedBeginDate",
        "type": "date"
    },
    {
        "id": "plannedEndDate",
        "title": "plannedEndDate",
        "type": "date"
    },
    {
        "id": "realizedBeginDate",
        "title": "realizedBeginDate",
        "type": "date"
    },
    {
        "id": "realizedEndDate",
        "title": "realizedEndDate",
        "type": "date"
    },
    {
        "id": "name",
        "title": "name",
        "type": "textfield"
    },
    {
        "id": "email",
        "title": "email",
        "type": "email"
    },
    {
        "id": "phone",
        "title": "phone",
        "type": "textfield"
    },
    {
        "id": "organisation",
        "title": "organisation",
        "type": "textfield"
    }],
   [{
      "id": "additionalInfo",
      "title": "additionalInfo",
      "type": "textarea"
    },
    {
      "id": "dataProvider",
      "title": "dataProvider",
      "type": "textfield"
    },
    {
      "id": "dataReliability",
      "title": "dataReliability",
      "type": "select",
      "placeHolderText": "Valitse",
          "values": [
          {
              "id": "A",
              "title": "A"
          },
          {
              "id": "B",
              "title": "B"
          },
          {
              "id": "C",
              "title": "C"
          }
          ]
      }], 
  ]
};

export default inputDefinitions;