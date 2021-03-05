<template>
  <div class="scan">
    <form @submit.prevent @keydown.enter.prevent="addItemManually">
      <fieldset>
        <legend>Scan</legend>
        <StreamBarcodeReader @decode="addItem"></StreamBarcodeReader>
        <ImageBarcodeReader
          @decode="addItem"
          @error="onError"
        ></ImageBarcodeReader>
        <input v-model="barcode" type="text" placeholder="type code" />
        <button @click.prevent="addItemManually">Add</button>
      </fieldset>
    </form>
    <div>
      <h1>Total: ฿{{ priceBaht(total) }}</h1>
      <table>
        <tr>
          <th>Code</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
        <tr v-for="item in basket" :key="item.id">
          <td>{{ item.barcode }}</td>
          <td>{{ item.name }}</td>
          <td>฿{{ priceBaht(item.priceSatang) }}</td>
          <td>x{{ item.quantity }}</td>
          <td>
            <button @click.prevent="decItem(item.barcode)">-</button>
            <button @click.prevent="incItem(item.barcode)">+</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { findIndex, sum } from 'lodash'
import { Product } from '@/store/models'
import { StreamBarcodeReader, ImageBarcodeReader } from 'vue-barcode-reader'
import { mapState } from 'vuex'

@Component({
  components: {
    StreamBarcodeReader,
    ImageBarcodeReader
  },
  computed: mapState(['basket'])
})
export default class Scan extends Vue {
  basket!: Array<Product & { quantity: number }>
  barcode = ''

  get total (): number {
    return sum(
      this.basket.map(productWithQuantity => productWithQuantity.priceSatang * productWithQuantity.quantity)
    )
  }

  priceBaht (priceSatang: number): string {
    return (priceSatang / 100.0).toLocaleString(undefined, { minimumFractionDigits: 2 })
  }

  addItemManually (): void {
    const barcode = this.barcode
    if (!barcode) return // Ignore empty barcodes
    this.addItem(barcode)
  }

  addItem (barcode: string) {
    const index = findIndex(this.basket, item => item.barcode === barcode)

    // Increment if already present
    if (index >= 0) {
      const item = this.basket[index]
      item.quantity += 1
      return
    }

    // Else create new line-item
    const product = this.$store.getters.findProductById(barcode)
    const productWithQuantity = Object.assign(product, { quantity: 1 })
    this.basket.unshift(productWithQuantity)

    this.barcode = ''
  }

  onError () {
    console.log('Uploaded image could not be read')
  }

  incItem (barcode: string): void {
    // Ignore invalid indexes
    const index = findIndex(this.basket, item => item.barcode === barcode)
    if (index < 0 || index >= this.basket.length) return

    // Increment quantity
    const item = this.basket[index]
    item.quantity += 1
  }

  decItem (barcode: string): void {
    // Ignore invalid indexes
    const index = findIndex(this.basket, item => item.barcode === barcode)
    if (index < 0 || index >= this.basket.length) return

    // Decrement quantity
    const item = this.basket[index]
    item.quantity -= 1

    // Remove if 0
    if (item.quantity <= 0) this.basket.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
div {
  margin-bottom: 2rem;
  text-align: center;
}

form {
  display: inline-block;
}

table {
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0.4rem 0.4rem;
}

td {
  padding: 1.2rem 2rem;
  background-color: #f5f5f5;
}

td button {
  width: 1.75rem;
  height: 1.75rem;
}

td button:not(:last-child) {
  margin-right: 0.5rem;
}
</style>
