---
title: Portieren & Erlaubnis
description: "History Stages ist All Rights Reserved, mit einer Ausnahme: das Portieren auf eine andere Version oder einen anderen Loader, und die Bedingungen dafür."
sidebar_position: 3
---

# Auf andere Versionen & Loader portieren {/* #porting-to-other-versions--loaders */}

History Stages ist All Rights Reserved, aber mit einer Ausnahme: **Du darfst es ohne vorherige Anfrage
auf eine andere Minecraft-Version oder einen anderen Mod-Loader portieren.** Ein paar Bedingungen musst
du trotzdem einhalten, und diese Seite geht sie in einfachen Worten durch.

Der genaue Wortlaut steht in Abschnitt 3 von
[LICENSE.txt](https://github.com/Flix100000/History-Stages/blob/neoforge-1.21.X/LICENSE.txt). Sollten
diese Seite und die Lizenz je voneinander abweichen, zählt dieser Text.

## Warum es das gibt {/* #why-this-exists */}

Die Mod erscheint nur für die Versionen, die der Entwickler tatsächlich spielt und testet. Alles andere,
ältere Versionen, neuere, Loader, die nicht abgedeckt sind, wäre sonst unerreichbar, und eine Mod, die
niemand weiterbringen darf, stirbt still mit ihrem letzten Release. Die Ausnahme für Ports ist der Weg
heraus, ohne gleich das ganze Projekt abzugeben.

## Was als Port zählt {/* #what-counts-as-a-port */}

Ein **technischer Port** ist dieselbe Mod, die woanders läuft. Du schreibst die Teile neu, die die
Ziel-Version oder der Ziel-Loader dich neu schreiben lässt, also Registries, Events, Mixins, Rendering
und Netzwerk, und die Mod verhält sich so wie in der offiziellen Version.

Alles andere ist kein Port:

- Neue Stage-Arten, neue Sperr-Kategorien, neue Blöcke, neue GUIs
- Funktionen entfernen oder umbauen, weil du sie lieber anders hättest
- Forschungszeiten, Drops oder Kosten neu ausbalancieren
- Sie in eine größere eigene Mod einbauen

Nichts davon ist für immer verboten, es muss nur vorher abgesprochen werden. Frag auf
[Discord](https://discord.gg/BeZzxyZ9c4) oder in einem GitHub-Issue, **bevor** du anfängst zu bauen,
nicht danach.

## Die drei Bedingungen {/* #the-three-conditions */}

| | Was du tun musst |
| :--- | :--- |
| **1. Ein Port bleiben** | Keine Funktionen, Inhalte oder Gameplay-Änderungen über die technische Anpassung hinaus. Fehlerbehebungen, die ein Versionsunterschied erzwingt, sind in Ordnung; neues Verhalten nicht. |
| **2. Bescheid sagen** | Vor oder bei der Veröffentlichung den Entwickler kontaktieren (Discord oder ein GitHub-Issue) und Zugriff auf den vollständigen Quellcode des Ports geben. Auf jeder Plattform, auf der du veröffentlichst, das Lizenzfeld auf eine **eigene Lizenz** (Custom License) setzen, die auf die Lizenzdatei deines Ports verlinkt. |
| **3. Öffentlich und genannt bleiben** | Der Quellcode des Ports bleibt öffentlich. Er enthält eine unveränderte Kopie der Original-Lizenz (z. B. als `LICENSE-ORIGINAL.txt`) und deine eigene Port-Lizenz aus Anhang A. Jede Projektseite, und die Credits im Spiel, wo der Port welche hat, nennt **History Stages** als Original-Mod und verlinkt auf das [offizielle Repository](https://github.com/Flix100000/History-Stages). |

Ein Port, der alle drei erfüllt, kann als **verifizierter Port** im Wiki und auf den offiziellen Seiten
bei CurseForge, Modrinth und GitHub aufgeführt werden, damit Spieler ihn über das Hauptprojekt finden
statt durch Glück.

Ein Port, der sie nicht erfüllt, ist nicht erlaubt und fällt unter die normale Regel „keine
eigenständigen Forks“.

## Die Lizenzdatei deines Ports {/* #your-ports-license-file */}

Juristischen Text musst du nicht selbst schreiben. Anhang A der Lizenz ist eine Vorlage zum Ausfüllen:
Kopier sie als eigene Lizenzdatei in dein Repository, füll die Felder in Klammern aus und leg eine
unveränderte Kopie der Original-Lizenz daneben.

Die Vorlage legt absichtlich zwei Urheberrechte übereinander: Die Original-Mod bleibt bei Flix100000,
und der Code, den du für den Port geschrieben hast, gehört dir. Die Bedingungen bleiben dieselben wie
beim Original, damit ein Port nicht dazu dienen kann, die Mod durch die Hintertür unter eine offenere
Lizenz zu stellen.

## Ein Hinweis zu den Lizenzfeldern der Plattformen {/* #a-note-on-platform-license-fields */}

CurseForge und Modrinth haben beide eine echte Option **Custom License**, getrennt von ihrer Vorlage
„All Rights Reserved“. Nimm die eigene und lass sie auf die Lizenzdatei deines Ports zeigen. Die
ARR-Vorlage liest sich für Spieler wie „überhaupt keine Erlaubnis“, und das sagen weder das Original noch
dein Port.

## Fragen {/* #questions */}

Wenn hier etwas unklar ist oder dein Plan irgendwo zwischen „Port“ und „eigene Mod“ liegt, frag einfach,
bevor du die Zeit investierst:

- [Discord](https://discord.gg/BeZzxyZ9c4)
- [GitHub-Issue](https://github.com/Flix100000/History-Stages/issues)
