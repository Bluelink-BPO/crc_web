import fs from 'fs'
import path from 'path'

// Interfaces
interface DatabaseSchema {
  products: Product[]
  clients: Client[]
  sales: Sale[]
  paymentHistory: PaymentHistory[]
  settings: AppSettings
}

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  minStock: number
  createdAt: string
  updatedAt: string
}

interface Client {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  address?: string
  createdAt: string
  updatedAt: string
}

interface SaleItem {
  productId: string
  quantity: number
  price: number
  subtotal: number
}

interface Sale {
  id: string
  clientId: string
  items: SaleItem[]
  totalAmount: number
  status: "paid" | "unpaid" | "partial"
  date: string
  paymentMethod?: string
  paidAmount?: number
  pendingAmount?: number
  createdAt: string
  updatedAt: string
}

interface PaymentHistory {
  id: string
  saleId: string
  amount: number
  date: string
  method?: string
  createdAt: string
}

interface AppSettings {
  businessName: string
  businessPhone: string
  currency: string
  timezone: string
  lastBackup: string
  version: string
}

interface DatabaseSchema {
  products: Product[]
  clients: Client[]
  sales: Sale[]
  paymentHistory: PaymentHistory[]
  settings: {
    businessName: string
    businessPhone: string
    currency: string
    timezone: string
    lastBackup: string
    version: string
  }
}

// Clase principal
class LocalDatabase {
  private version = "1.0.0"
  private dbFilePath = path.join(process.cwd(), 'carnistock_db.json')

  constructor() {
    if (!fs.existsSync(this.dbFilePath)) {
      this.saveToFile(this.getDefaultData())
    }
  }

  private getDefaultData(): DatabaseSchema {
    return {
      products: [],
      clients: [],
      sales: [],
      paymentHistory: [],
      settings: {
        businessName: "Carnes JyA",
        businessPhone: "+57 300 123 4567",
        currency: "COP",
        timezone: "America/Bogota",
        lastBackup: new Date().toISOString(),
        version: this.version,
      },
    }
  }

  private loadFromFile(): DatabaseSchema {
    try {
      const raw = fs.readFileSync(this.dbFilePath, 'utf-8')
      return JSON.parse(raw)
    } catch (error) {
      console.error("❌ Error leyendo el archivo:", error)
      const defaultData = this.getDefaultData()
      this.saveToFile(defaultData)
      return defaultData
    }
  }

  public saveToFile(data: DatabaseSchema): boolean {
    try {
      data.settings.lastBackup = new Date().toISOString()
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf-8')
      return true
    } catch (error) {
      console.error("Error al guardar el archivo JSON:", error)
      return false
    }
  }

  // === Métodos públicos ===

  public getAllData(): DatabaseSchema {
    return this.loadFromFile()
  }

  public getSaleById(id: string): Sale | null {
    const data = this.loadFromFile()
    return data.sales.find(sale => sale.id === id) || null
  }

  public setProducts(updatedProducts: Product[]) {
    const data = this.loadFromFile()
    data.products = updatedProducts
    this.saveToFile(data)
  }


  public saveAll(data: DatabaseSchema): void {
    this.saveToFile(data)
  }


  public getProducts(): Product[] {
    return this.loadFromFile().products
  }

  public addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const data = this.loadFromFile()
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.products.push(newProduct)
    this.saveToFile(data)
    return newProduct
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const data = this.loadFromFile()
    const index = data.products.findIndex((p) => p.id === id)
    if (index === -1) return null
    data.products[index] = {
      ...data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveToFile(data)
    return data.products[index]
  }

  public deleteProduct(id: string): boolean {
    const data = this.loadFromFile()
    const originalLength = data.products.length
    data.products = data.products.filter(p => p.id !== id)
    if (data.products.length < originalLength) {
      this.saveToFile(data)
      return true
    }
    return false
  }

  public getClients(): Client[] {
    return this.loadFromFile().clients
  }

  public addClient(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Client {
    const data = this.loadFromFile()
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.clients.push(newClient)
    this.saveToFile(data)
    return newClient
  }

  public updateClient(id: string, updates: Partial<Client>): Client | null {
    const data = this.loadFromFile()
    const index = data.clients.findIndex(c => c.id === id)
    if (index === -1) return null
    data.clients[index] = {
      ...data.clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveToFile(data)
    return data.clients[index]
  }

  public deleteClient(id: string): boolean {
    const data = this.loadFromFile()
    const originalLength = data.clients.length
    data.clients = data.clients.filter(c => c.id !== id)
    if (data.clients.length < originalLength) {
      this.saveToFile(data)
      return true
    }
    return false
  }

  public getSales(): Sale[] {
    return this.loadFromFile().sales
  }

  public addSale(sale: Omit<Sale, "id" | "createdAt" | "updatedAt">): Sale {
    const data = this.loadFromFile()
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    data.sales.push(newSale)
    this.saveToFile(data)
    return newSale
  }

  public updateSale(id: string, updatedFields: Partial<Sale>): Sale | null {
    const data = this.loadFromFile()
    const index = data.sales.findIndex(s => s.id === id)
    if (index === -1) return null

    const oldSale = data.sales[index]
    const updatedSale = {
      ...oldSale,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    }

    data.sales[index] = updatedSale
    this.saveToFile(data)

    return updatedSale
  }


  public deleteSale(id: string): boolean {
    const data = this.loadFromFile()
    const originalLength = data.sales.length
    data.sales = data.sales.filter(s => s.id !== id)
    if (data.sales.length < originalLength) {
      this.saveToFile(data)
      return true
    }
    return false
  }

  public getPaymentHistory(): PaymentHistory[] {
    return this.loadFromFile().paymentHistory
  }

  public addPayment(payment: Omit<PaymentHistory, "id" | "createdAt">): PaymentHistory {
    const data = this.loadFromFile()
    const newPayment: PaymentHistory = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    data.paymentHistory.push(newPayment)
    this.saveToFile(data)
    return newPayment
  }

  public getSettings(): AppSettings {
    return this.loadFromFile().settings
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    const data = this.loadFromFile()
    data.settings = {
      ...data.settings,
      ...updates,
    }
    this.saveToFile(data)
    return data.settings
  }

  public exportData(): string {
    return JSON.stringify(this.loadFromFile(), null, 2)
  }

  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData)
      if (parsed.products && parsed.clients && parsed.sales) {
        this.saveToFile(parsed)
        return true
      }
      return false
    } catch (e) {
      console.error("Error importando datos:", e)
      return false
    }
  }

  public clearAllData(): void {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        fs.unlinkSync(this.dbFilePath)
        console.log("Archivo eliminado correctamente.")
      }
    } catch (e) {
      console.error("Error al eliminar la base de datos:", e)
    }
  }

  public getStorageSize(): string {
    const data = this.exportData()
    const sizeInBytes = Buffer.byteLength(data, 'utf-8')
    const sizeInKB = (sizeInBytes / 1024).toFixed(2)
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2)

    if (sizeInBytes < 1024) return `${sizeInBytes} bytes`
    else if (sizeInBytes < 1024 * 1024) return `${sizeInKB} KB`
    else return `${sizeInMB} MB`
  }

  public createBackup(): string {
    try {
      const data = this.loadFromFile()
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const fileName = `carnistock-backup-${timestamp}.json`
      const backupPath = path.join(__dirname, fileName)
      fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8')
      return fileName
    } catch (e) {
      console.error("Error al crear backup:", e)
      return ""
    }
  }
}

export const db = new LocalDatabase()
