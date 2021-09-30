import React from "react";
import styled from 'styled-components';

export const inputFields = [
    [
        {
            "id": "nimi",
            "title": "Massakohteen nimi",
            "description": "Anna tähän maamassakohteen nimi.",
            "type": "textfield",
            "rules": [{ required: false }]
        },
        {
            "id": "osoite",
            "title": "Massakohteen osoite",
            "description": "Anna tähän maamassakohteen osoite.",
            "type": "textfield",
            "rules": [{ required: false }]
        },
        {
            "id": "kunta",
            "title": "Kunta",
            "description": "Valitse avautuvalta listalta maamassakohteen kunta.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: true, message: 'Valitse kunta' }],
            "values": [
                {
                    "id": "049",
                    "title": "Espoo",
                },
                {
                    "id": "091",
                    "title": "Helsinki",
                },
                {
                    "id": "092",
                    "title": "Vantaa"
                }
            ]
        },
        {
            "id": "kohdetyyppi",
            "title": "Kohdetyyppi",
            "description": "Valitse avautuvalta listalta maamassakohteeseen sopiva kohdetyyppi.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: true, message: 'Valitse kohdetyyppi' }],
            "values": [
                {
                    "id": "kaavoitusalue",
                    "title": "Kaavoitusalue",
                },
                {
                    "id": "käsittelypaikka",
                    "title": "Käsittelypaikka"
                },
                {
                    "id": "loppusijoituspaikka",
                    "title": "Loppusijoituspaikka"
                },
                {
                    "id": "maanottoalue",
                    "title": "Maanottoalue"
                },
                {
                    "id": "pima-alue",
                    "title": "Pima-alue"
                },
                {
                    "id": "suunnittelualue",
                    "title": "Suunnittelualue"
                },
                {
                    "id": "työmaa",
                    "title": "Työmaa"
                },
                {
                    "id": "välivarasto",
                    "title": "Välivarasto"
                }
            ]
        },
        {
            "id": "vaihe",
            "title": "Vaihe",
            "description": "Valitse avautuvalta listalta maamassakohteeseen sopiva suunnitteluvaihe.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: true, message: 'Valitse vaihe' }],
            "values": [
                {
                    "id": "asemakaavoitus",
                    "title": "Asemakaavoitus"
                },
                {
                    "id": "ei relevantti tieto",
                    "title": "Ei relevantti tieto"
                },
                {
                    "id": "esi- ja yleissuunnittelu",
                    "title": "Esi- ja yleissuunnittelu"
                },
                {
                    "id": "esirakentaminen",
                    "title": "Esirakentaminen"
                },
                {
                    "id": "katu- ja puistosuunnittelu",
                    "title": "Katu- ja puistosuunnittelu"
                },
                {
                    "id": "rakennussuunnittelu",
                    "title": "Rakennussuunnittelu"
                },
                {
                    "id": "rakentaminen",
                    "title": "Rakentaminen"
                },
                {
                    "id": "yleiskaavoitus",
                    "title": "Yleiskaavoitus"
                }
            ]
        }
    ],
    [
        {
            "id": "henkilo_nimi",
            "title": "Maamassasta vastaavan nimi",
            "description": "Kirjaa tähän kohdetta hallinnoivan tahon nimi.",
            "type": "textfield",
            "rules": [{ required: true, message: 'Syötä nimi' }]
        },
        {
            "id": "henkilo_email",
            "title": "Email",
            "description": "Kirjaa tähän kohdetta hallinnoivan tahon sähköpostiosoite.",
            "type": "email",
            "rules": [{ required: true, type:'email', message: 'Syötä email osoite' }]
        },
        {
            "id": "henkilo_puhelin",
            "title": "Puhelin",
            "description": "Kirjaa tähän kohdetta hallinnoivan tahon puhelinnumero.",
            "type": "textfield",
            "rules": [{ required: true, message: 'Syötä puhelinnumero' }]
        },
        {
            "id": "henkilo_organisaatio",
            "title": "Organisaatio",
            "description": "Kirjaa tähän kohdetta hallinnoivan tahon edustama organisaatio.",
            "type": "textfield",
            "rules": [{ required: true, message: 'Syötä organisaatio' }]
        }
    ],
    [
        {
            "id": "alku_pvm",
            "title": "Arvioitu kohteen aloitus kuukausi",
            "description": "Valitse avautuvasta kalenterista kohteen toteutuksen arvioitu aloitusajankohta. Arvion ei tarvitse olla tarkka, vaan suuntaa antava.",
            "type": "month",
            "rules": [{ required: true, message: 'Valitse arvioitu kohteen aloitus kuukausi' }]
        },
        {
            "id": "loppu_pvm",
            "title": "Arvioitu kohteen lopetus kuukausi",
            "description": "Valitse avautuvasta kalenterista kohteen toteutuksen arvioitu lopetusajankohta. Arvion ei tarvitse olla tarkka, vaan suuntaa antava.",
            "type": "month",
            "rules": [{ required: true, message: 'Valitse arvioitu kohteen lopetus kuukausi' }]
        }
    ],
    [
        {
            "id": "maamassatiedot",
            "title": "Maamassan tiedot",
            "description": "Kirjaa tälle sivulle edellä kirjatun kohteen kaikki maamassalajit omille riveilleen. Voit myös muokata taulukon rivi kerrallaan.",
            "type": "table",
            "rules": [{ required: false }]
        }
    ],
    [
        {
            "id": "maamassan_tila",
            "title": "Maamassan tila",
            "description": "Valitse avautuvalta listalta maamassakohteen massan tila. Joko Kaivettava (ylijäämä) tai tarvittava (alijäämä).",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: true,  message: 'Valitse maamassan tila'  }],
            "values": [
                {
                    "id": "alijäämä/tarvittava",
                    "title": "Tarvittava (alijäämä)"
                },
                {
                    "id": "ylijäämä/kaivettava",
                    "title": "Kaivettava (ylijäämä)"
                }
            ]
        },
        {
            "id": "maamassan_ryhma",
            "title": "Maamassan ryhmä",
            "description": "Valitse avautuvalta listalta kohteen maamassalajin pääryhmä.",
            "type": "select",
            "placeHolderText": "Valitse",
            "values": [
                {
                    "id": "eloperäiset maalajit",
                    "title": "Eloperäiset maalajit"
                },
                {
                    "id": "hienorakeiset maalajit",
                    "title": "Hienorakeiset maalajit"
                },
                {
                    "id": "karkearakeiset maalajit",
                    "title": "Karkearakeiset maalajit"
                },
                {
                    "id": "moreenimaalajit",
                    "title": "Moreenimaalajit"
                },
                {
                    "id": "uusiomateriaalit",
                    "title": "Uusiomateriaalit"
                }
            ]
        },
        {
            "id": "maamassan_laji",
            "title": "Maamassan laji",
            "description": "Valitse avautuvalta listalta kohteen tarkka maamassalaji.",
            "type": "select",
            "placeHolderText": "Valitse",
            "values": [
                {
                    "id": "asfalttimurske-/rouhe",
                    "title": "Asfalttimurske-/rouhe"
                },
                {
                    "id": "betonimurske",
                    "title": "Betonimurske"
                },
                {
                    "id": "hiekka",
                    "title": "Hiekka"
                },
                {
                    "id": "hiekkamoreeni",
                    "title": "Hiekkamoreeni"
                },
                {
                    "id": "kalkki",
                    "title": "Kalkki"
                },
                {
                    "id": "kevytbetoni- ja kevytsora-jätteet",
                    "title": "Kevytbetoni- ja kevytsora-jätteet"
                },
                {
                    "id": "kivi",
                    "title": "Kivi"
                },
                {
                    "id": "lieju",
                    "title": "Lieju"
                },
                {
                    "id": "lohkare",
                    "title": "Lohkare"
                },
                {
                    "id": "louhe",
                    "title": "Louhe"
                },
                {
                    "id": "rengasrouhe",
                    "title": "Rengasrouhe"
                },
                {
                    "id": "savi",
                    "title": "Savi"
                },
                {
                    "id": "siltti",
                    "title": "Siltti"
                },
                {
                    "id": "silttimoreeni",
                    "title": "Silttimoreeni"
                },
                {
                    "id": "sora",
                    "title": "Sora"
                },
                {
                    "id": "soramoreeni",
                    "title": "Soramoreeni"
                },
                {
                    "id": "tiilimurske",
                    "title": "Tiilimurske"
                },
                {
                    "id": "tuhka ja kuona",
                    "title": "Tuhka ja kuona"
                },
                {
                    "id": "turve",
                    "title": "Turve"
                },
                {
                    "id": "täyttömaa",
                    "title": "Täyttömaa"
                },
                {
                    "id": "valimohiekka",
                    "title": "Valimohiekka"
                }
            ]
        },
        {
            "id": "amount_remaining",
            "title": "Määrä (m³)",
            "description": <p>Kirjaa kohteen määrä kuutioina. Lisätietoja kuutioiden määrittelystä löydät <a target="_blank" href="https://www.rakennustieto.fi/html/liitteet/infraryl/Infra_2015_Maaramittausohje.pdf#page=167">täältä</a></p>,
            "type": "number",
            "rules": [{ required: true, message: 'Syötä määrä' }]
        },
        {
            "id": "varattu",
            "title": "Varattu",
            "description": "Valitse onko maamassa varattu.",
            "type": "boolean",
            "rules": [{ required: false }]
        },
        {
            "id": "planned_begin_date",
            "title": "Arvioitu aloitusajankohta",
            "description": "Valitse avautuvasta kalenterista maamassalajin toteutuksen arvioitu aloitusajankohta.",
            "type": "month",
            "rules": [{ required: true, message: 'Valitse arvioitu aloitusajankohta' }]
        },
        {
            "id": "planned_end_date",
            "title": "Arvioitu lopetusajankohta",
            "description": "Valitse avautuvasta kalenterista maamassalajin toteutuksen arvioitu lopetusajankohta.",
            "type": "month",
            "rules": [{ required: true, message: 'Valitse arvioitu lopetusajankohta' }]
        },
        {
            "id": "realized_begin_date",
            "title": "Toteutunut aloitusajankohta",
            "description": "Valitse avautuvasta kalenterista maamassalajin toteutunut aloitusajankohta.",
            "type": "month",
            "rules": [{ required: false }]
        },
        {
            "id": "realized_end_date",
            "title": "Toteutunut lopetusajankohta",
            "description": "Valitse avautuvasta kalenterista maamassalajin toteutunut lopetusajankohta.",
            "type": "month",
            "rules": [{ required: false }]
        }
    ],
    [
        {
            "id": "kelpoisuusluokkaryhma",
            "title": "Kelpoisuusluokkaryhmä",
            "description": "Valitse avautuvalta listalta maamassalajin kelpoisuusluokka yleisemmällä ryhmätasolla.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: false }],
            "values": [
                {
                    "id": "hyvä (s1-s3/h1-h2)",
                    "title": "Hyvä (s1-s3/h1-h2)"
                },
                {
                    "id": "keski (s4/h3-h4)",
                    "title": "Keski (s4/h3-h4)"
                },
                {
                    "id": "huono (u1-u4/tv)",
                    "title": "Huono (u1-u4/tv)"
                }
            ]
        },
        {
            "id": "kelpoisuusluokka",
            "title": "Kelpoisuusluokka",
            "description": "Valitse avautuvalta listalta kohteen kelpoisuusluokka tarkemmalla tasolla.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: false }],
            "values": [
                {
                    "id": "h1",
                    "title": "h1"
                },
                {
                    "id": "h2",
                    "title": "h2"
                },
                {
                    "id": "h3",
                    "title": "h3"
                },
                {
                    "id": "h4",
                    "title": "h4"
                },
                {
                    "id": "s1",
                    "title": "s1"
                },
                {
                    "id": "s2",
                    "title": "s2"
                },
                {
                    "id": "s3",
                    "title": "s3"
                },
                {
                    "id": "s4",
                    "title": "s4"
                },
                {
                    "id": "tv",
                    "title": "tv"
                },
                {
                    "id": "u1",
                    "title": "u1"
                },
                {
                    "id": "u2",
                    "title": "u2"
                },
                {
                    "id": "u3",
                    "title": "u3"
                },
                {
                    "id": "u4",
                    "title": "u4"
                }
            ]
        },
        {
            "id": "pilaantuneisuus",
            "title": "Pilaantuneisuus",
            "description": "Valitse avautuvalta listalta kohteen pilaantuneisuus-tieto.",
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: false }],
            "values": [
                {
                    "id": "pilaantumaton maa",
                    "title": "Pilaantumaton maa"
                },
                {
                    "id": "pilaantunut maa, alemman ohjearvon ylittämä",
                    "title": "Pilaantunut maa, alemman ohjearvon ylittämä"
                },
                {
                    "id": "pilaantunut maa, ylemmän ohjearvon ylittämä",
                    "title": "Pilaantunut maa, ylemmän ohjearvon ylittämä"
                },
                {
                    "id": "vaarallinen jäte (jätelainsäädäntö)",
                    "title": "Vaarallinen jäte (jätelainsäädäntö)"
                }
            ]
        }
    ],
    [
        {
            "id": "lisatieto",
            "title": "Lisätieto",
            "description": "Kirjaa tähän kohteeseen mahdollisesti liittyviä muita tarkentavia tietoja.",
            "type": "textarea",
            "rules": [{ required: false }],
        },
        {
            "id": "tiedontuottaja",
            "title": "Tiedontuottaja",
            "description": "Anna tähän kohdetta koskevien maamassatietojen kirjaajan tiedot.",
            "type": "textfield",
            "rules": [{ required: false }],
        },
        {
            "id": "tiedon_luotettavuus",
            "title": "Tiedon luotettavuus",
            "description": <div><p>A, Laatu varmistetaan kairauksilla, näytetutkimuksilla ja/tai maatutkalla ennen rakentamista ja rakenteet suunnitellaan ja toteutetaan tutkimustulosten mukaan.</p><p>B, Laatua ei tutkita tarkasti (kairaus- ja näytemäärä on vähäinen) tai laatu on arvioitu.</p><p>C, Laatu todetaan vasta rakentamisen aikana ja rakentamisaikataulu sovitetaan siten, että korjaaviin toimenpiteisiin on mahdollisuus.</p></div>,
            "type": "select",
            "placeHolderText": "Valitse",
            "rules": [{ required: false }],
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
        },
        {
            "id": "liitteet",
            "title": "Linkki",
            "description": "Lisää tähän linkki maamassatietoja koskevista lisätiedoista.",
            "type": "textfield",
            "placeHolderText": "Lisää linkki",
            "rules": [{ required: false }],
        },
        // {
        //     "id": "linkit",
        //     "title": "Linkit",
        //     "description": "Lisää tähän maamassatietoja koskevia linkkejä.",
        //     "type": "list",
        //     "placeHolderText": "Lisää linkki",
        //     "rules": [{ required: false }],
        // },
    ]
];