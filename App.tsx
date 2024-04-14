import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function App() {
  const [tablero, setTablero] = React.useState<any[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [turno, setTurno] = React.useState<boolean>(true);
  const [local, setLocal] = React.useState<any[]>([]);
  const [visitante, setVisitante] = React.useState<any[]>([]);
  const [ganador, setGanador] = React.useState<string | null>(null);
  const [parpadeo, setParpadeo] = React.useState<any | object>(false);
  const [vecesGanadasLocal, setVecesGanadasLocal] = React.useState<number>(0);
  const [vecesGanadasVisitante, setVecesGanadasVisitante] = React.useState<number>(0);

  const parpadear = (fila: number, columna: number, who: string) => {
    setParpadeo({ "fila": fila, "columna": columna, "who": who });
  }

  const handlePress = (fila: number, columna: number) => {
    if (parpadeo) {
      setParpadeo(false);
    }
    if (turno) {
      // Sustituir la posicion del tablero por X
      const nuevoTablero = [...tablero];
      let nuevoLocal = [...local];
      if (nuevoTablero[fila][columna] === "X" || nuevoTablero[fila][columna] === "O") {
        return;
      }
      if (local.length === 3) {
        const ultimoMovimiento = local[0];
        nuevoTablero[ultimoMovimiento.fila][ultimoMovimiento.columna] = 0;
        nuevoLocal = local.slice(1);
      }
      nuevoTablero[fila][columna] = "X";
      nuevoLocal.push({ "fila": fila, "columna": columna });
      setLocal(nuevoLocal);
      setTablero(nuevoTablero);
    } else {
      // Sustituir la posicion del tablero por O
      const nuevoTablero = [...tablero];
      let nuevoVisitante = [...visitante];
      if (nuevoTablero[fila][columna] === "X" || nuevoTablero[fila][columna] === "O") {
        return;
      }
      if (visitante.length === 3) {
        const ultimoMovimiento = visitante[0];
        nuevoTablero[ultimoMovimiento.fila][ultimoMovimiento.columna] = 0;
        nuevoVisitante = visitante.slice(1);
      }
      nuevoTablero[fila][columna] = "O";
      nuevoVisitante.push({ "fila": fila, "columna": columna });
      setVisitante(nuevoVisitante);
      setTablero(nuevoTablero);
    }
    setTurno(!turno);
    const ganador = knowIfWin();
    if (ganador) {
      setGanador(ganador);
      if (ganador === "X") {
        setVecesGanadasLocal(vecesGanadasLocal + 1);
      } else {
        setVecesGanadasVisitante(vecesGanadasVisitante + 1);
      }
    }
    if (turno) {
      if (visitante.length === 3) {
        parpadear(visitante[0].fila, visitante[0].columna, "O");
      }
    } else {
      if (local.length === 3) {
        parpadear(local[0].fila, local[0].columna, "X");
      }
    }
  }

  function knowIfWin() {
    const lineasGanadoras = [
      // Combinaciones horizontales
      [tablero[0][0], tablero[0][1], tablero[0][2]],
      [tablero[1][0], tablero[1][1], tablero[1][2]],
      [tablero[2][0], tablero[2][1], tablero[2][2]],
      // Combinaciones verticales
      [tablero[0][0], tablero[1][0], tablero[2][0]],
      [tablero[0][1], tablero[1][1], tablero[2][1]],
      [tablero[0][2], tablero[1][2], tablero[2][2]],
      // Combinaciones diagonales
      [tablero[0][0], tablero[1][1], tablero[2][2]],
      [tablero[0][2], tablero[1][1], tablero[2][0]],
    ];

    for (const linea of lineasGanadoras) {
      if (linea.every((casilla) => casilla === "X")) {
        return "X";
      }
      if (linea.every((casilla) => casilla === "O")) {
        return "O";
      }
    }

    return null;
  }

  const reiniciarJuego = () => {
    setTablero([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    setTurno(true);
    setLocal([]);
    setVisitante([]);
    setGanador(null);
    setParpadeo(false);
  }

  if (ganador) {
    return (
      <View style={styles.container}>
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
        <View style={styles.container2}>
          <Text style={styles.textoGanador}>¡Ha ganado {ganador}!</Text>
          <Text style={styles.textoGanador}>X: {vecesGanadasLocal}</Text>
          <Text style={styles.textoGanador}>O: {vecesGanadasVisitante}</Text>
          <TouchableWithoutFeedback onPress={reiniciarJuego}>
            <View style={styles.botonReiniciar}>
              <Text style={styles.textoBoton}>Reiniciar</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Turno de {
          turno ? "X" : "O"
        }</Text>
        <View style={styles.fila}>
          <TouchableWithoutFeedback onPress={() => handlePress(0, 0)}>
            <View style={[styles.columna, { borderBottomWidth: 1, borderRightWidth: 1 }]}>
              {
                parpadeo != false && parpadeo.fila == 0 && parpadeo.columna == 0 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[0][0] === 0 ? "" : tablero[0][0]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(0, 1)}>
            <View style={[styles.columna, { borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }]}>

              {
                parpadeo != false && parpadeo.fila == 0 && parpadeo.columna == 1 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[0][1] === 0 ? "" : tablero[0][1]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(0, 2)}>
            <View style={[styles.columna, { borderBottomWidth: 1, borderLeftWidth: 1 }]}>

              {
                parpadeo != false && parpadeo.fila == 0 && parpadeo.columna == 2 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[0][2] === 0 ? "" : tablero[0][2]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.fila}>
          <TouchableWithoutFeedback onPress={() => handlePress(1, 0)}>
            <View style={[styles.columna, { borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 1 }]}>

              {
                parpadeo != false && parpadeo.fila == 1 && parpadeo.columna == 0 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[1][0] === 0 ? "" : tablero[1][0]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(1, 1)}>
            <View style={[styles.columna, { borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 1, borderLeftWidth: 1 }]}>
              {
                parpadeo != false && parpadeo.fila == 1 && parpadeo.columna == 1 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[1][1] === 0 ? "" : tablero[1][1]}
                  </Text>
              }
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(1, 2)}>
            <View style={[styles.columna, { borderBottomWidth: 1, borderLeftWidth: 1, borderTopWidth: 1 }]}>
              {
                parpadeo != false && parpadeo.fila == 1 && parpadeo.columna == 2 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[1][2] === 0 ? "" : tablero[1][2]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.fila}>
          <TouchableWithoutFeedback onPress={() => handlePress(2, 0)}>
            <View style={[styles.columna, { borderTopWidth: 1, borderRightWidth: 1 }]}>

              {
                parpadeo != false && parpadeo.fila == 2 && parpadeo.columna == 0 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[2][0] === 0 ? "" : tablero[2][0]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(2, 1)}>
            <View style={[styles.columna, { borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1 }]}>

              {
                parpadeo != false && parpadeo.fila == 2 && parpadeo.columna == 1 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[2][1] === 0 ? "" : tablero[2][1]}
                  </Text>
              }

            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handlePress(2, 2)}>
            <View style={[styles.columna, { borderTopWidth: 1, borderLeftWidth: 1 }]}>
              {
                parpadeo != false && parpadeo.fila == 2 && parpadeo.columna == 2 ? <Text style={{ color: "red" }}>{parpadeo.who}</Text>
                  : <Text>
                    {tablero[2][2] === 0 ? "" : tablero[2][2]}
                  </Text>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fila: {
    flexDirection: 'row',
  },
  columna: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    minHeight: 70,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoGanador: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botonReiniciar: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  textoBoton: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
