import { View, Text, TouchableHighlight } from 'react-native';
import obterCotacao from '../services/brapiService'
export default function HomeScreen() {

  const pegarCotacao = async () =>{
    const dados = await obterCotacao('BPAC11');
    console.log('pegarCotação funcionando', dados.results[0].data);
    
  }
  return (
    <View className="flex-1 items-center justify-center bg-zinc-100">
      <Text className="text-xl font-bold text-cyan-500">
        Caronte Invest!  
      </Text>
      <TouchableHighlight onPress={pegarCotacao}>
        <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
          Pegar Cotação
        </Text>
      </TouchableHighlight>
    </View>
  );
}


