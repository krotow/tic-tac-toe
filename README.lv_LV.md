# Krustiņi un nullītes

Šī tiešsaistes programma īsteno modificētu populāras galda spēles "Krustiņi
un nullītes" (angļu: Tic-Tac-Toe) algoritmu spēlēšanai diviem fiziskajiem
spēlētājiem Interneta pārlūkprogrammā.

Atšķirībā no oriģinālās "Krustiņi un nullītes" spēles, ko spēlē kvadrāta
formas laukumā un uzvarai vienam spēlētājam jāaizpilda visa rinda, kolonna
vai kāda no kvadrāta diagonālēm, šīs spēles modifikācija pieļauj spēlēšanu
iepriekš uzdota izmēra taisnstūra formas laukumā un izvēlēties dažāda garuma
uzvaras virkni.

# Spēles noteikumi

1.  Spēles laukums ir no 2x2 līdz 10x10 rūtiņām.

2.  Spēlētāji pēc kārtas lauka brīvajās rūtiņās izvieto pa vienai savai zīmei
    (krustiņu vai nullīti).

3.  Gājienu izlaist nav iespējams.

4.  Spēlē uzvar spēlētājs, kurš vienā līnijā - rindā, kolonnā vai diagonāli -
    pēc kārtas izvietojis iepriekš uzstādīto skaitu savu zīmju.

5.  Spēles rezultāts ir neizšķirts, ja spēles laukā nav palikusi neviena
    brīva rūtiņa un spēlē neviens nav uzvarējis.

# Spēles gaita

Sākot jaunu spēli, norāda spēles nosacījumus:

*   Spēles laukuma izmēru "Laukums" laukos. No 2 līdz 10 rūtiņām.
*   Uzvaras virknes garumu "Uzvaras virknes garums" laukā. Mazākais - 2
    rūtiņas. Lielākais - mazākais kolonnas vai rindas rūtiņu skaits no
    "Laukums" lauciņiem.
*   Spēlētāja vārdu, kurš spēlēs ar krustiņa zīmi laukā "Spēlētājs X".
*   Spēlētāja vārdu, kurš spēlēs ar nullītes zīmi laukā "Spēlētājs O".

Noklusējuma spēles lauka garums, platums un uzvaras virknes garums - 
3 rūtiņas.

Norādītos spēles nosacījumus var atgriezt uz noklusētajiem, spiežot pogu 
"Atiestatīt".

Jaunu spēli uzsāk, spiežot pogu "Sākt spēli". "Spēli sāk" rāmī izvēlas 
spēlētāju, kurš veiks pirmo gājienu.

Spēlētāji pēc kārtas veic gājienus, iezīmējot neaizpildītās spēles laukuma 
rūtiņas. Spēle beidzas, kad kāds no spēlētājiem vienā līnijā aizpildījis 
uzvaras virknes garumam atbilstošo skaitu rūtiņu. Vai arī visas lauka 
rūtiņas aizpildītas, taču neviens nav uzvarējis.

Notīrīt spēles lauku un turpināt spēli var, spiežot pogu "Turpināt". Turpinot 
spēli pirmais sāk tas spēlētājs, kurš iepriekšējā reizē sāka otrais.

Spēles pārtraukšanai un jaunas spēles nosacījumu uzstādīšanai spiest pogu 
"Jauna spēle".

# Demo

Spēles demonstrācijas adrese: http://tic-tac-toe-1gk.pages.dev/

# Izstrādātājiem

Spēle veidota kā vienas lapas [Node.js](https://nodejs.org/en/) Web aplikācija,
izmantojot tikai HTML, CSS un JavaScript. Automātiskās uzstādīšanas nodrošināšanai
[Cloudfare Pages](https://pages.cloudflare.com/) aplikācijai pievienots rudimentārs
[Next.js](https://nextjs.org/) atbalsts.

Lokālai demonstrācijai spēle jāielādē un jāuzstāda no Github repozitorija

```
git clone https://github.com/krotow/tic-tac-toe.git
cd tic-tac-toe
npm install
```

un jāstartē izstrādes režīmā.

```
npm run dev
```

Pēc tam spēles demonstrāciju var atvērt pārlūkprogrammā. Lokālā adrese: http://localhost:3000/

---
&copy; 2021, Jānis Baumanis, [ISC](https://choosealicense.com/licenses/isc/)
