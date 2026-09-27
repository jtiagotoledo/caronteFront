import { View, Text, TouchableHighlight, TextInput, TouchableWithoutFeedback, Alert, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { salvarOperacao, } from '@/db/database';
import { pesquisaPorTicker, ItemPesquisa } from '../services/brapiService'
import { CampoData } from "../components/campoData";

export default function HomeScreen() {

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ticker, setTicker] = useState<ItemPesquisa | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [valorCompra, setValorCompra] = useState('');
  const [listaTickers, setListaTickers] = useState<ItemPesquisa[]>([]);
  const [dataOperacao, setDataOperacao] = useState(new Date());
  const [dataBanco, setDataBanco] = useState(new Date().toISOString().split("T")[0]);

  const salvarNoBanco = async (ticker: string, quantidade: string, dataCompra: string, valorCompra: string) => {
    
    if(quantidade===''||valorCompra===''){
      Alert.alert('A quantidade de papéis e o preço são obrigatórios!');
      return;
    }

    const valorCompraNormatizado = parseFloat(valorCompra.replace(',', '.'));
    
    const salvarOk = salvarOperacao(ticker.toUpperCase(), parseInt(quantidade), dataCompra, valorCompraNormatizado);
    if (salvarOk) {
      Alert.alert('Operação salva com sucesso.');
    } else {
      Alert.alert('Não foi possível salvar a operação.');
    }
    router.replace('./');
    
  }

  const onChangeTicker = async (tickerSearch: string) => {
    const resultadoPesquisa = await pesquisaPorTicker(tickerSearch);
    setListaTickers(resultadoPesquisa);
  }

  const selecionarTicker = (item: ItemPesquisa) => {
    setTicker(item);
  }

  const rendeItemPesquisa = (item: ItemPesquisa) => {
    return (
      <Pressable
        className="bg-white p-3 mb-2 rounded-xl border border-zinc-200 flex-row items-center"
        onPress={() => selecionarTicker(item)}
      >
        <View className="w-10 h-20 mr-3 items-center justify-center overflow-hidden">
          <Image
            source={item.logoUrl}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>

        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-amber-600">
            {item.ticker}
          </Text>

          <Text
            className="text-xs text-zinc-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.nome}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className='flex-1 bg-zinc-100'>

      {/* toolbar */}
      <View style={{ paddingTop: insets.top }} className='flex-row items-center justify-between h-28 bg-slate-900 px-4'>

        <TouchableWithoutFeedback
          className='flex-row items-center'
          onPress={() => router.replace('./')}
        >
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableWithoutFeedback>

        <View className='flex-row items-center '>
          <Text className='text-amber-600 text-2xl'>Adicionar Operação</Text>
        </View>

        <View className='w-10' />

      </View>

      {/* componente */}
      {!ticker &&
        <View>
          <View className="flex-row items-center bg-zinc-100 p-4 border border-zinc-200">
            <Ionicons name='search' size={30} color='black' className='mr-4' />
            <TextInput
              className='flex-1 text-2xl text-amber-600'
              placeholder='Digite o tiker aqui'
              onChangeText={(text) => onChangeTicker(text)}
              keyboardType="visible-password"
            />

          </View>
          <FlatList
            data={listaTickers}
            keyExtractor={(item) => item.ticker}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            renderItem={({ item }) => rendeItemPesquisa(item)}
          />
        </View>
      }

      {ticker &&

        <View className="flex-1 items-center bg-zinc-100 p-4">
          <View className="w-24 h-24 items-center justify-center overflow-hidden mb-4">
            <Image
              source={ticker.logoUrl}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
          </View>
          <View className="justify-center mb-10">
            <Text className="text-2xl font-bold text-amber-600">
              {ticker.ticker}
            </Text>
          </View>

          <CampoData
            label="Data da compra"
            dataSelecionada={dataOperacao}
            aoMudarData={(formatoBanco, objetoData) => {
              setDataBanco(formatoBanco);
              setDataOperacao(objetoData);
              console.log('formatoBanco,objetoData',formatoBanco,objetoData);
              
            }}
          />

          <TextInput
            className='border border-slate-700 mt-4 p-4 w-full rounded-xl text-base'
            placeholder='Quantos papéis?'
            placeholderTextColor='#000000'
            onChangeText={(text) => setQuantidade(text)}
            inputMode='numeric'
          />

          <TextInput
            className='border border-slate-700 mt-4 p-4 w-full rounded-xl text-base'
            placeholder='Preço por papel'
            placeholderTextColor='#000000'
            onChangeText={(text) => setValorCompra(text)}
            inputMode='numeric'
          />

          <TouchableHighlight onPress={() => salvarNoBanco(ticker.ticker, quantidade, dataBanco, valorCompra)}>
            <Text className='bg-slate-900 rounded-md text-sm text-white p-4 mt-8'>
              SALVAR OPERAÇÃO
            </Text>
          </TouchableHighlight>

        </View>
      }
    </View>
  );
}


