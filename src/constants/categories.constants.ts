import { ICreateCategoryDTO } from 'src/dto/create-category.dto';
import { ECategoryType } from 'src/enums/category-type.enum';

export const initialCategories: ICreateCategoryDTO[] = [
  { categoryName: 'Alojamiento', categoryType: ECategoryType.SPENT, iconLabel: 'apartment', iconColor: 'cyan' },
  { categoryName: 'Educación', categoryType: ECategoryType.SPENT, iconLabel: 'school', iconColor: 'green' },
  { categoryName: 'Entretenimiento', categoryType: ECategoryType.SPENT, iconLabel: 'stadia_controller', iconColor: 'rose' },
  { categoryName: 'Familia', categoryType: ECategoryType.SPENT, iconLabel: 'family_group', iconColor: 'emerald' },
  { categoryName: 'Mandado', categoryType: ECategoryType.SPENT, iconLabel: 'shopping_basket', iconColor: 'orange' },
  { categoryName: 'Mascotas', categoryType: ECategoryType.SPENT, iconLabel: 'pets', iconColor: 'pink' },
  { categoryName: 'Otros gastos', categoryType: ECategoryType.SPENT, iconLabel: 'stacks', iconColor: 'violet' },
  { categoryName: 'Restaurantes', categoryType: ECategoryType.SPENT, iconLabel: 'local_dining', iconColor: 'purple' },
  { categoryName: 'Ropa', categoryType: ECategoryType.SPENT, iconLabel: 'apparel', iconColor: 'lime' },
  { categoryName: 'Salud', categoryType: ECategoryType.SPENT, iconLabel: 'ecg_heart', iconColor: 'amber' },
  { categoryName: 'Seguros', categoryType: ECategoryType.SPENT, iconLabel: 'car_rental', iconColor: 'blue' },
  { categoryName: 'Servicios', categoryType: ECategoryType.SPENT, iconLabel: 'lightbulb', iconColor: 'sky' },
  { categoryName: 'Suscripciones', categoryType: ECategoryType.SPENT, iconLabel: 'subscriptions', iconColor: 'fuchsia' },
  { categoryName: 'Transporte', categoryType: ECategoryType.SPENT, iconLabel: 'transportation', iconColor: 'indigo' },
  
  { categoryName: 'Beneficios del gobierno', categoryType: ECategoryType.INCOME, iconLabel: 'account_balance', iconColor: 'teal' },
  { categoryName: 'Bonos y comisiones', categoryType: ECategoryType.INCOME, iconLabel: 'finance_chip', iconColor: 'yellow' },
  { categoryName: 'Renta', categoryType: ECategoryType.INCOME, iconLabel: 'villa', iconColor: 'red' },
  { categoryName: 'Freelance', categoryType: ECategoryType.INCOME, iconLabel: 'person_play', iconColor: 'amber-600' },
  { categoryName: 'Inversiones', categoryType: ECategoryType.INCOME, iconLabel: 'currency_bitcoin', iconColor: 'indigo-600' },
  { categoryName: 'Otros', categoryType: ECategoryType.INCOME, iconLabel: 'stacks', iconColor: 'purple-600' },
  { categoryName: 'Propinas', categoryType: ECategoryType.INCOME, iconLabel: 'price_change', iconColor: 'teal-600' },
  { categoryName: 'Salario', categoryType: ECategoryType.INCOME, iconLabel: 'business_center', iconColor: 'cyan-600' },
  
  { categoryName: 'Transacción', categoryType: ECategoryType.TRANSACTION, iconLabel: 'swap_horiz', iconColor: 'blue-300' },
];