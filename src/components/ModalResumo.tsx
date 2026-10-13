import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface itemOperacao {
    id: number;
    ticker: string;
    nome: string;
    qnt_papeis: number;
    data_compra: string;
    valor_compra: number;
    data_venda: string | null;
    valor_venda: number | null;
    cotacaoAtual: number;
    variacao: number;
    variacaoPercentual: number;
}

interface ModalResumoProps {
  visible: boolean;
  onClose: () => void;
  item: itemOperacao | null;
  onExcluir: (id: number) => void;
  onEditar: (item: itemOperacao) => void;
  onFecharPosicao: (item: itemOperacao) => void;
}

export function ModalResumo({ 
  visible, 
  onClose, 
  item, 
  onExcluir, 
  onEditar, 
  onFecharPosicao 
}: ModalResumoProps) {
  if (!item) {
    return null;
  }

  const formatarData = (dataStr: string | null) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const totalInvestido = item.qnt_papeis * item.valor_compra;
  const valorTotalAtual = item.qnt_papeis * item.cotacaoAtual;
  const variacaoTotalReais = valorTotalAtual - totalInvestido;
  const variacaoTotalPercentual = totalInvestido > 0 ? (variacaoTotalReais / totalInvestido) * 100 : 0;

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center items-center bg-black/50 px-4'>
        <View className='bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl'>
          
          {/* Título com Ticker em amber-600 */}
          <View className='mb-4 border-b border-zinc-100 pb-3'>
            <Text className='text-2xl font-bold text-amber-600'>{item.ticker}</Text>
            <Text className='text-xs text-zinc-400' numberOfLines={1}>{item.nome}</Text>
          </View>

          {/* Informações */}
          <View className='space-y-2 mb-6'>
            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Quantidade:</Text>
              <Text className='font-medium text-slate-700 text-sm'>{item.qnt_papeis} papéis</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Preço de Compra:</Text>
              <Text className='font-medium text-slate-700 text-sm'>R$ {item.valor_compra.toFixed(2)}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Total Investido:</Text>
              <Text className='font-medium text-slate-700 text-sm'>R$ {totalInvestido.toFixed(2)}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Data da Compra:</Text>
              <Text className='font-medium text-slate-700 text-sm'>{formatarData(item.data_compra)}</Text>
            </View>

            <View className='flex-row justify-between border-t border-zinc-100 pt-2 mt-1'>
              <Text className='text-zinc-500 text-sm'>Cotação Atual:</Text>
              <Text className='font-medium text-slate-700 text-sm'>R$ {item.cotacaoAtual.toFixed(2)}</Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Valor Atual Total:</Text>
              <Text className='font-medium text-slate-700 text-sm'>R$ {valorTotalAtual.toFixed(2)}</Text>
            </View>

            <View className='flex-row justify-between border-t border-zinc-100 pt-2 mt-1'>
              <Text className='text-zinc-500 text-sm'>Variação Diária:</Text>
              <Text className={`font-medium text-sm ${item.variacao >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {item.variacao.toFixed(2)} ({item.variacaoPercentual.toFixed(2)}%)
              </Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-zinc-500 text-sm'>Lucro / Prejuízo:</Text>
              <Text className={`font-medium text-sm ${variacaoTotalReais >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {variacaoTotalReais.toFixed(2)} ({variacaoTotalPercentual.toFixed(2)}%)
              </Text>
            </View>

            {item.data_venda && (
              <>
                <View className='flex-row justify-between border-t border-zinc-100 pt-2 mt-1'>
                  <Text className='text-zinc-500 text-sm'>Data da Venda:</Text>
                  <Text className='font-medium text-slate-700 text-sm'>{formatarData(item.data_venda)}</Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text className='text-zinc-500 text-sm'>Valor de Venda:</Text>
                  <Text className='font-medium text-slate-700 text-sm'>R$ {item.valor_venda?.toFixed(2)}</Text>
                </View>
              </>
            )}
          </View>

          {/* BARRA DE BOTÕES DISCRETOS E SÓBRIOS */}
          <View className='flex-row justify-between items-center border-t border-zinc-100 pt-4 mt-2'>
            <View className='flex-row items-center'>
              {/* Fechar Posição com ícone de dinheiro/venda (cash-outline) */}
              {!item.data_venda && (
                <Pressable 
                  onPress={() => onFecharPosicao(item)}
                  className='items-center p-2 rounded-lg bg-zinc-100 mr-2'
                  accessibilityLabel="Fechar Posição"
                >
                  <Ionicons name="cash-outline" size={18} color="#059669" />
                </Pressable>
              )}

              {/* Editar */}
              <Pressable 
                onPress={() => onEditar(item)}
                className='items-center p-2 rounded-lg bg-zinc-100 mr-2'
                accessibilityLabel="Editar Operação"
              >
                <Ionicons name="pencil-outline" size={18} color="#52525b" />
              </Pressable>

              {/* Excluir */}
              <Pressable 
                onPress={() => onExcluir(item.id)}
                className='items-center p-2 rounded-lg bg-zinc-100'
                accessibilityLabel="Excluir Operação"
              >
                <Ionicons name="trash-outline" size={18} color="#e11d48" />
              </Pressable>
            </View>

            {/* Fechar Modal */}
            <Pressable 
              onPress={onClose}
              className='py-2 px-4 rounded-lg bg-slate-900'
            >
              <Text className='text-white text-sm font-medium'>Fechar</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}