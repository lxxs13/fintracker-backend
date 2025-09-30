import { ICreateCategoryDTO } from 'src/dto/create-category.dto';
import { ECategoryType } from 'src/enums/category-type.enum';

export const initialCategories: ICreateCategoryDTO[] = [
  {
    categoryName: 'Alojamiento',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'apartment',
    iconColor: 'cyan-600',
  },
  {
    categoryName: 'Educación',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'school',
    iconColor: 'green-600',
  },
  {
    categoryName: 'Entretenimiento',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'stadia_controller',
    iconColor: 'red-700',
  },
  {
    categoryName: 'Familia',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'family_group',
    iconColor: 'green-700',
  },
  {
    categoryName: 'Mandado',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'shopping_basket',
    iconColor: 'orange-700',
  },
  {
    categoryName: 'Mascotas',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'pets',
    iconColor: 'pink-600',
  },
  {
    categoryName: 'Otros gastos',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'stacks',
    iconColor: 'purple-600',
  },
  {
    categoryName: 'Restaurantes',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'local_dining',
    iconColor: 'fuchsia-700',
  },
  {
    categoryName: 'Ropa',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'apparel',
    iconColor: 'green-500',
  },
  {
    categoryName: 'Salud',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'ecg_heart',
    iconColor: 'yellow-700',
  },
  {
    categoryName: 'Seguros',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'car_rental',
    iconColor: 'purple-700',
  },
  {
    categoryName: 'Servicios',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'lightbulb',
    iconColor: 'blue-800',
  },
  {
    categoryName: 'Suscripciones',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'subscriptions',
    iconColor: 'emerald-700',
  },
  {
    categoryName: 'Transporte',
    categoryType: ECategoryType.SPENT,
    iconLabel: 'transportation',
    iconColor: 'indigo-700',
  },
  {
    categoryName: 'Beneficios del gobierno',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'account_balance',
    iconColor: 'green-700',
  },
  {
    categoryName: 'Bonos y comisiones',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'finance_chip',
    iconColor: 'cyan-700',
  },
  {
    categoryName: 'Freelance',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'person_play',
    iconColor: 'yellow-700',
  },
  {
    categoryName: 'Inversiones',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'currency_bitcoin',
    iconColor: 'fuchsia-700',
  },
  {
    categoryName: 'Otros',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'stacks',
    iconColor: 'orange-800',
  },
  {
    categoryName: 'Propinas',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'price_change',
    iconColor: 'green-600',
  },
  {
    categoryName: 'Renta',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'villa',
    iconColor: 'rose-600',
  },
  {
    categoryName: 'Salario',
    categoryType: ECategoryType.INCOME,
    iconLabel: 'business_center',
    iconColor: 'indigo-800',
  },
];
