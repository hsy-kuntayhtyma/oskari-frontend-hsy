Oskari.registerLocalization({
    "lang": "fi",
    "key": "Printout",
    "value": {
        "title": "Tulosta näkymä",
        "flyouttitle": "Siirry tulostamaan",
        "desc": "",
        "btnTooltip": "Tulosta",
        "BasicView": {
            "title": "Tulosta nykyinen karttanäkymä. (Tulosteessa voi olla esitettynä kerrallaan vain 8 karttatasoa.)",
            "name": {
                "label": "Kartan nimi",
                "placeholder": "pakollinen",
                "tooltip": "Anna näkymälle kuvaileva nimi. Huomioi käyttöliittymän kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "Suomi",
                    "sv": "Ruotsi",
                    "en": "Englanti"
                },
                "tooltip": "Valitse kieli, jota käytetään tulosteella. Huomioi käyttöliittymän ja aineiston kieli."
            },
            "size": {
                "label": "Koko",
                "tooltip": "Valitse arkkikoko. Näet karttanäkymän valitussa koossa esikatselukuvassa.",
                "options": [{
                    "id": "A4",
                    "label": "A4-tuloste",
                    "classForPreview": "preview-portrait",
                    "selected": true
                }, {
                    "id": "A4_Landscape",
                    "label": "A4-vaakatuloste",
                    "classForPreview": "preview-landscape"
                }, {
                    "id": "A3",
                    "label": "A3-tuloste",
                    "classForPreview": "preview-portrait"
                }, {
                    "id": "A3_Landscape",
                    "label": "A3-vaakatuloste",
                    "classForPreview": "preview-landscape"
                }]
            },
            "preview": {
                "label": "Esikatselu",
                "tooltip": "Voit suurentaa esikatselukuvaa klikkaamalla kuvaa hiirellä.",
                "pending": "Esikatselukuva päivitetään hetken kuluttua.",
                "notes": {
                    "extent": "Esikatselukuvasta voit tarkistaa tulosteen kattavuusalueen, joka poikkeaa hieman karttaikkunalla esitetystä alueesta.",
                    "restriction": "Esikatselukuvassa ei näytetä kaikkia karttatasoja."
                }
            },
            "buttons": {
                "save": "Hae tuloste",
                "ok": "OK",
                "back": "Edellinen",
                "cancel": "Peruuta"
            },
            "location": {
                "label": "Sijainti ja mittakaavataso",
                "tooltip": "Mittakaavataso vastaa selaimessa näkyvän karttanäkymän mittakaavaa.",
                "zoomlevel": "Mittakaavataso"
            },
            "settings": {
                "label": "Lisäasetukset",
                "tooltip": "Valitse karttatulosteelle tiedostomuoto, otsikko, mittakaava ja päivämäärä."
            },
            "format": {
                "label": "Tiedostomuoto",
                "tooltip": "Valitse tulosteen tiedostomuoto",
                "options": [{
                    "id": "png",
                    "format": "image/png",
                    "label": "PNG-kuva"
                }, {
                    "id": "pdf",
                    "format": "application/pdf",
                    "selected": true,
                    "label": "PDF-dokumentti"
                }]
            },
            "mapTitle": {
                "label": "Pdf-dokumenttiin lisättävät ominaisuudet: </br>Kartan otsikko",
                "tooltip": "Anna karttatulosteelle otsikko."
            },
            "content": {
                "options": [{
                    "id": "pageLogo",
                    "label": "Näytä HSYn logo tulosteessa.",
                    "tooltip": "Voit halutessasi piilottaa HSYn logon tulosteesta.",
                    "checked": "checked"
                }, {
                    "id": "pageScale",
                    "label": "Näytä mittakaava",
                    "tooltip": "Voit halutessasi näyttää tulosteessa kartan mittakaavan.",
                    "checked": "checked"
                }, {
                    "id": "pageDate",
                    "label": "Näytä päivämäärä",
                    "tooltip": "Voit halutessasi lisätä tulosteeseen päivämäärän.",
                    "checked": "checked"
                }]
            },
            "legend": {
                "label": "Karttaselite",
                "tooltip": "Valitse karttaselitteelle paikka. Karttaselitettä ei näytetä tulosteessa, jos paikkaa ei valittuna.",
                "options": [{
                    "id": "oskari_legend_NO",
                    "loca": "NO",
                    "label": "Ei karttaselitettä.",
                    "tooltip": "Karttaselitettä ei näytetä tulosteessa.",
                    "selected": true
                }, {
                    "id": "oskari_legend_LL",
                    "loca": "LL",
                    "label": "Vasen alanurkka",
                    "tooltip": "Karttaselite näytetään tulosteen vasemmassa alanurkassa."
                }, {
                    "id": "oskari_legend_LU",
                    "loca": "LU",
                    "label": "Vasen ylänurkka",
                    "tooltip": "Karttaselite näytetään tulosteen vasemmassa ylänurkassa."
                }, {
                    "id": "oskari_legend_RU",
                    "loca": "RU",
                    "label": "Oikea ylänurkka",
                    "tooltip": "Karttaselite näytetään tulosteen oikeassa ylänurkassa."
                }, {
                    "id": "oskari_legend_RL",
                    "loca": "RL",
                    "label": "Oikea alanurkka",
                    "tooltip": "Karttaselite näytetään tulosteen oikeassa alanurkassa."
                }]
            },
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "size": "Tulosteen koko on virheellinen.",
                "name": "Kartan nimi on pakollinen tieto.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Karttanäkymän tulostus epäonnistui. Yritä myöhemmin uudelleen.",
                "nameIllegalCharacters": "Kartan nimessä on luvattomia merkkejä. Sallittuja merkkejä ovat kaikki suomen kielen aakkoset, numerot sekä välilyönti ja yhdysmerkki."
            }
        },
        "StartView": {
            "text": "Voit tulostaa tekemäsi karttanäkymän PNG-kuvaksi tai PDF-tulosteeksi.",
            "info": {
                "maxLayers": "Tulosteessa voi olla enintään kahdeksan karttatasoa.",
                "printoutProcessingTime": "Kartan tulostus voi kestää hetken, jos useita karttatasoja on valittuna."
            },
            "buttons": {
                "continue": "Jatka",
                "cancel": "Peruuta"
            }
        }
    }
}, true);

Oskari.registerLocalization({
    "lang": "fi",
    "key": "userinterface.UserGuide",
    "value": {
        "tabs": [{
            "title": "Karttaikkuna",
            "tags": "ohje_karttaikkuna"
        }, {
            "title": "Työkalut",
            "tags": "ohje_tyokalut"
        }, {
            "title": "Haku",
            "tags": "ohje_haku"
        }, {
            "title": "Karttatasot",
            "tags": "ohje_karttatasot"
        }, {
            "title": "Latauskori",
            "tags": "ohje_latauskori"
        }]
    }
}, true);

Oskari.registerLocalization({
    "lang": "fi",
    "key": "userinterface.admin.UserGuide",
    "value": {
        "tabs": [{
            "title": "Karttaikkuna",
            "tags": "ohje_karttaikkuna"
        }, {
            "title": "Työkalut",
            "tags": "ohje_tyokalut"
        }, {
            "title": "Haku",
            "tags": "ohje_haku"
        }, {
            "title": "Karttatasot",
            "tags": "ohje_karttatasot"
        }, {
            "title": "Latauskori",
            "tags": "ohje_latauskori"
        },
        {
            "title": "Karttatasojen hallinta",
            "tags": "ohje_karttatasot_hallinta"
        }]
    }
}, true);

Oskari.registerLocalization({
    "lang": "fi",
    "key": "download-basket",
    "value": {
        "title" : "Latauskori",
        "desc" : "",
        "tile": {
            "title": "Latauskori"
        },
        "flyout": {
            "title": "Latauskori",
            "download-basket-cropping-tab" : {
                "title" : "Rajaus",
                "choose-cropping-mode" : "Valitse haluamasi rajausvaihtoehto",
                "choose-wanted-areas-from-map" : "Valitse kartalta klikkaamalla alue tai alueet, joilta haluat ladata aineistoja. Rajaus ottaa mukaan kaikki aineistot, jotka leikkaavat rajausalueen  kanssa. Mikäli kerralla ladattava aineistokokonaisuus on tiedostokooltaan suuri, saattaa lataamisessa kestää pidempään. Latauskoriin siirretyt aineistot näkyvät latauskori-välilehdellä. Poista rajaus klikkaamalla valitsemaasi aluetta uudestaan.",
                "users-temp-basket" : "Alueita valittuna: <strong></strong> kpl, haluatko siirtää kohteet latauskoriin?",
                "move-to-basket" : "Siirrä latauskoriin",
                "temp-basket-empty" : "Poista valinta",
                "rect-cropping" : "Suorakaide",
                "error-in-getfeatureforcropping" : "Alueen valitseminen epäonnistui",
                "want-to-move-basket" : "Haluatko lisätä valitut alueet latauskoriin?",
                "notify-move-to-basket" : "Olet vaihtamassa rajausaineistoa, haluatko siirtää valitut alueet latauskoriin?",
                "no" : "En",
                "yes" : "Kyllä",
                "no-layers-selected-title" : "Valitse karttataso",
                "no-layers-selected-message" : "Valitse haluamasi aineistot KARTTATASOT valikosta, joista haluat ladata aineistoa",
                "basket-raster-problem-title" : "Huomautus",
                "basket-raster-problem" : "Karttatasoa ei voida toistaiseksi ladata palvelusta."
            },
            "download-basket-tab" : {
                "title" : "Latauskori",
                "basket-is-empty" : "Latauskorisi on tyhjä",
                "basket-empty" : "Tyhjennä",
                "basket-prev" : "Edellinen",
                "basket-next" : "Seuraava",
                "basket-send" : "Lataa aineistot",
                "insert-email-for-download" : "Kirjoita tähän sähköpostiosoitteesi. Sähköpostiosoitettasi pyydetään vain aineistotoimitusta varten. Sitä ei tallenneta käyttäjärekisteriin HSY:n toimesta, eikä osoitettasi luovuteta eteenpäin.",
                "privacy-policy" : "Tietosuojaseloste",
                "basket-user-email" : "Sähköpostiosoite",
                "basket-user-email-sure" : "Varmista sähköpostiosoite",
                "check-form-error" : "Tarkista sähköpostiosoitteet",
                "error-in-downloading" : "Aineistojen lataus epäonnistui",
                "basket-thank-you" : "Kiitos latauksesta!",
                "basket-email-will-be" : "Ilmoittamaasi sähköpostisoitteeseen lähetetään linkki, josta voit käydä lataamassa aineistot. Latauslinkin lähettäminen saattaa kestää hieman, jos ladattavat aineistot ovat kooltaan suuria.",
                "basket-cropping-layer-title" : "Rajausaineisto: ",
                "basket-license-title" : "Käyttöehdot: ",
                "basket-license-name" : "Creative Commons BY 4.0",
                "basket-license-url" : " https://creativecommons.org/licenses/by/4.0/deed.fi"
            }
        }
    }
},true);