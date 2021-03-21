 # Übung 1 - Javascript Grundlagen #

 Starter Code:
 * **[MyMath.js](MyMath.js)**
 
 Diese Dateien müssen nicht verändert werden:
 * **[myMath.html](myMath.html)**
 * **[index.js](index.js)**
 * **[main.css](main.css)**

 ## 00. Vorbereitung ##

* Falls ihr es noch nicht gemacht habt, klont mit VSC das GitHub Repository auf euren Computer 
* Erstellt einen neuen Branch für die heutige Übung. z.B. `Ü1-bearbeitung`
* Rechtsklickt `myMath.html` in VSC und wählt `Open with Live Server`.
* Drückt `F12` im Browser um die browsereigene Entwicklungsumgebung zu öffnen.

## 01. Erste Schritte ##

[MyMath.js](MyMath.js) ist bereits teilimplementiert, ihr könnt in der Browserkonsole eine Instanz davon aufrufen. `let myMath = new MyMath(5)`
Ihr könnt auch schon Methoden auf dieser Instanz aufrufen, die allerdings noch nicht machen, da dies der Inhalt der heutigen Übung ist. `myMath.add(3)`

* Im Konstruktor von MyMath, wird der übergeben Wert in `this.value` gespeichert
* Sorgt dafür dass `this.value`, falls kein Wert übergeben wird, auf `0` gesetzt wird.

## 02. Grundrechenarten ##

Implementiere die Grundrechenarten: `add()`, `subtract()`, `multiply()`, `divide()`

Schau dir an was passiert, wenn du in Javascript durch 0 teilst. In unserer Klasse wollen wir dies unterbinden, und bei einer Division durch 0 den Wert nicht verändern.

Kontrolliere wieder in der Konsole deinen Fortschritt. `a = new MyMath(); a.add(4);` sollte z.B. dazu führen dass `a.value` `4` zurückgibt.

## 03. Potenz ##

Implementiere die Potenzfunktion: `pow()`

Verwende dabei nicht die in Javascript eingebaute `Math.pow()` Methode oder den `**` Operator, du kannst aber mithilfe dieser dein Ergebniss kontrollieren.
Eine For-Schleife könnte hier hilfreich sein. 

Beachte, dass diese Lösung keine negativen Potenzen oder Brüche vorsieht. Überprüfe deswegen ob die übergebene Potenz positiv und ganzzahlig ist.

Sobald dies funktioniert, schreibe den Code so um, dass er auch negative Potenzen berechnen kann.
Errinnerung: `n^-x = 1 / n^x`

## 04. Fakultät ##

Implementiere die Funktion `faculty()`, die die Fakultät n! des aktuellen Wertes unserer MyMath Instanz berechnet.

Die Formel hierzu lautet: `n! = n ⋅ (n - 1) ⋅ (n - 2) ⋅ ... ⋅ 1`

Die Fakultät ist nur für Ganzzahlen definiert, überprüfe deswegen vorher ob deine aktuelle Zahl dies erfüllt. Dies ist mit `n % 1 === 0` überprüfbar, der Modulo-Operator `%` berechnet hier den Rest der Division durch 1, der bei Ganzzahlen immer 0 ist.

Falls dies nicht erfüllt ist, ignoriere die Anweisung und ändere den Wert nicht.

## 05. Chaining ##

Wir wollen nun Ausdrücke wie `a.add(4).multiply(3)` ermöglichen, dies schaffen wir mithilfe von Chaining.

Chaining erfordert einfach nur, dass jede (chainable) Funktion einer Klasse die aktuelle Instanz dieser zurückgibt. Dies erreichen wir indem wir `this` zurückgeben.

Spiel ein wenig mit den neuen Funktionalitäten in der Konsole.

## 06. (BONUS) Daten parsen ##

#### Theorie ####
Im Unfang eines Kalenderprogramms wollen wir aus beliebigen Uhrzeiten einen wiederkehrenden Termin im **iCal** Format (verwendet von Google Kalender, Microsoft Outlook, macOS/iOS Kalender) generieren.

**iCal**'s Terminwiederholungssyntax erlaubt aber nicht einfach die Zeiten zu hinterlegen. Statt dessen müssen diese in **byHour** und **byMinute** umgeformt werden. 

`[08:15, 09:15]` wird `byHour: [8,9], byMinute: [15]`

Was geschieht bei minimal komplexeren Zeiten?
`[08:00, 09:30]` wird erst einmal `byHour: [8,9], byMinute: [0,30]`

Dies beschreibt aber `[8:00, 8:30, 9:00, 9:30]` da einfach alle Kombinationen verwendet werden.
Deswegen erlaubt uns **bySetPos** die gewollten Zeiten aus diesem Array zu filtern.
Es ergibt sich `bySetPos: [1,4]`, da wir den ersten (`8:00`) und den vierten (`9:30`) Eintrag benötigen. 
(**bySetPos ist 1-based nicht 0-based!**)

#### Aufgabe ####

Schreibe zwei Funktionen, eine die ein Array von Zeiten in byHour, byMinute, bySetPos umformt, und eine zweite die diese in das Array zurückführt.
