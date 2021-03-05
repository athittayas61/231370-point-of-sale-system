import { findIndex, keyBy } from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { firestore } from '@/_services/firebase-initialized'
import { Product } from './models'

Vue.use(Vuex)

interface PossStore {
  basket: Array<Product & {quantity: number}>
  products: Array<Product>
}

const store = new Vuex.Store<PossStore>({
  state: {
    basket: [],
    products: []
  },
  getters: {
    productsKeyed: (state) => keyBy(state.products, 'barcode'),
    findProductById: (_state, getters) => (id: string): Product => getters.productsKeyed[id] ??
      { barcode: id, name: 'Unknown Product', priceSatang: Number.NaN }
  },
  mutations: {
    ...vuexfireMutations,
    addItem: (state, barcode: string): void => {
      const index = findIndex(state.basket, item => item.barcode === barcode)

      // Increment if already present
      if (index >= 0) {
        const item = state.basket[index]
        item.quantity += 1
        return
      }

      // Else create new line-item
      const product = store.getters.findProductById(barcode)
      const productWithQuantity = Object.assign(product, { quantity: 1 })
      state.basket.unshift(productWithQuantity)
    },
    incItem: (state, barcode: string): void => {
      // Ignore invalid indexes
      const index = findIndex(state.basket, item => item.barcode === barcode)
      if (index < 0 || index >= state.basket.length) return

      // Increment quantity
      const item = state.basket[index]
      item.quantity += 1
    },
    decItem: (state, barcode: string): void => {
    // Ignore invalid indexes
      const index = findIndex(state.basket, item => item.barcode === barcode)
      if (index < 0 || index >= state.basket.length) return

      // Decrement quantity
      const item = state.basket[index]
      item.quantity -= 1

      // Remove if 0
      if (item.quantity <= 0) state.basket.splice(index, 1)
    }
  },
  actions: {
    initialize: firestoreAction(({ bindFirestoreRef }) => {
      return Promise.all([
        bindFirestoreRef('products', firestore.collection('products'))
      ])
    })
  },
  modules: { }
})

store.dispatch('initialize')

export default store
