import { Card, Text, Metric } from "@tremor/react";

function App() {
  return (
    <>
      <h1 className="text-center font-bold text-2xl"> Gestor I/E </h1>

      <Card className="max-w-xs mx-auto">
        <Text>Sales</Text>
        <Metric>$ 34,743</Metric>
      </Card>
    </>
  );
}

export default App;
