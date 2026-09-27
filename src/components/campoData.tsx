import { View, Text, Pressable, Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

interface CampoDataProps {
  label?: string;
  dataSelecionada: Date;
  aoMudarData: (dataIso: string, dataObj: Date) => void;
}

export function CampoData({  label = "Data da Operação",  dataSelecionada,  aoMudarData,}: CampoDataProps) {
  
  function abrirSeletorData() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dataSelecionada,
        mode: "date",
        maximumDate: new Date(),
        onValueChange: (_event, date) => {
          if (date) {
            const formatoBanco = date.toISOString().split("T")[0];
            aoMudarData(formatoBanco, date);
          }
        },
      });
    }
  }

  const dataFormatadaBr = dataSelecionada.toLocaleDateString("pt-BR");

  return (
    <View className="">

      <Pressable
        onPress={abrirSeletorData}
        className="border border-slate-700 bg-zinc-100 p-4 rounded-xl flex-row justify-between items-center w-full"
      >
        <Text className="text-black text-base"> Data da compra:  {dataFormatadaBr}</Text>
        <Text className="text-slate-400 text-xs"></Text>
      </Pressable>
    </View>
  );
}