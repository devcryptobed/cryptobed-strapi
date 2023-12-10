import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  BigIntegerAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  MediaAttribute,
  SetPluginOptions,
  DateAttribute,
  FloatAttribute,
  TextAttribute,
  RichTextAttribute,
  ComponentAttribute,
  ComponentSchema,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access', 'custom']> &
      RequiredAttribute &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: DateTimeAttribute;
    lifespan: BigIntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminApiTokenPermission extends CollectionTypeSchema {
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminTransferToken extends CollectionTypeSchema {
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: DateTimeAttribute;
    lifespan: BigIntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminTransferTokenPermission extends CollectionTypeSchema {
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    stays: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::stay.stay'
    >;
    avatar: MediaAttribute;
    token: StringAttribute & PrivateAttribute;
    address: StringAttribute;
    books: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::book.book'
    >;
    virtual_account: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::virtual-account.virtual-account'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiAmenityAmenity extends CollectionTypeSchema {
  info: {
    singularName: 'amenity';
    pluralName: 'amenities';
    displayName: 'Amenity';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    label: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    type: EnumerationAttribute<['general', 'other', 'safe']> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::amenity.amenity',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::amenity.amenity',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::amenity.amenity',
      'oneToMany',
      'api::amenity.amenity'
    >;
    locale: StringAttribute;
  };
}

export interface ApiBookBook extends CollectionTypeSchema {
  info: {
    singularName: 'book';
    pluralName: 'books';
    displayName: 'Book';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    host: RelationAttribute<
      'api::book.book',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    stay: RelationAttribute<'api::book.book', 'oneToOne', 'api::stay.stay'>;
    from: DateAttribute & RequiredAttribute;
    to: DateAttribute;
    priceNight: FloatAttribute &
      SetMinMax<{
        min: 0;
      }>;
    total: FloatAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 0;
      }>;
    guestAdults: IntegerAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 0;
      }> &
      DefaultTo<0>;
    guestChildren: IntegerAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 0;
      }> &
      DefaultTo<0>;
    guestInfants: IntegerAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 0;
      }> &
      DefaultTo<0>;
    guestAddress: StringAttribute & RequiredAttribute;
    payment: RelationAttribute<
      'api::book.book',
      'oneToOne',
      'api::payment.payment'
    >;
    nights: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::book.book', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::book.book', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiCountryCountry extends CollectionTypeSchema {
  info: {
    singularName: 'country';
    pluralName: 'countries';
    displayName: 'Country';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    iso: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      SetMinMaxLength<{
        minLength: 2;
        maxLength: 2;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::country.country',
      'oneToMany',
      'api::country.country'
    >;
    locale: StringAttribute;
  };
}

export interface ApiPaymentPayment extends CollectionTypeSchema {
  info: {
    singularName: 'payment';
    pluralName: 'payments';
    displayName: 'payment';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    hostAddress: StringAttribute & RequiredAttribute;
    guestAddress: StringAttribute & RequiredAttribute;
    book: RelationAttribute<
      'api::payment.payment',
      'oneToOne',
      'api::book.book'
    >;
    status: EnumerationAttribute<
      ['success', 'rejected', 'in-process', 'waiting-for-payment']
    > &
      DefaultTo<'waiting-for-payment'>;
    depositAddress: StringAttribute & RequiredAttribute;
    bookTotalAmount: FloatAttribute;
    fee: FloatAttribute;
    gasFee: FloatAttribute;
    depositAmount: FloatAttribute;
    releaseDepositTime: FloatAttribute;
    releaseHostTime: FloatAttribute;
    contractABI: JSONAttribute;
    contractAddress: StringAttribute;
    txHash: StringAttribute;
    coin: StringAttribute & RequiredAttribute;
    releaseStatus: EnumerationAttribute<
      [
        'released',
        'pending',
        'releasing',
        'refunded-to-guest',
        'partial-refunded-to-guest'
      ]
    >;
    releaseTxHash: StringAttribute;
    successDate: DateTimeAttribute;
    amount: BigIntegerAttribute;
    hostVirtualAccount: RelationAttribute<
      'api::payment.payment',
      'manyToOne',
      'api::virtual-account.virtual-account'
    >;
    splitVirtualPaymentsIds: JSONAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::payment.payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::payment.payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiStayStay extends CollectionTypeSchema {
  info: {
    singularName: 'stay';
    pluralName: 'stays';
    displayName: 'stay';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      UniqueAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    address: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    date: DateAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    href: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    commentCount: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    viewCount: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    reviewStart: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    reviewCount: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    like: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    galleryImgs: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    featuredImage: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    price: FloatAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    maxGuests: IntegerAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMax<{
        min: 1;
      }> &
      DefaultTo<0>;
    bedrooms: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    bathrooms: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    saleOff: FloatAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    isAds: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lat: TextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lng: TextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    listingCategory: RelationAttribute<
      'api::stay.stay',
      'oneToOne',
      'api::taxonomy-tpe.taxonomy-tpe'
    >;
    author: RelationAttribute<
      'api::stay.stay',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    description: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    rentalForm: EnumerationAttribute<['entire', 'private', 'share']> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      DefaultTo<'entire'>;
    beds: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    kitchens: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    acreage: FloatAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    preferredCoin: EnumerationAttribute<['usdt', 'dai']> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    depositAmount: FloatAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    exludeDates: ComponentAttribute<'utils.available-date', true> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::stay.stay', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::stay.stay', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::stay.stay',
      'oneToMany',
      'api::stay.stay'
    >;
    locale: StringAttribute;
  };
}

export interface ApiTaxonomyTpeTaxonomyTpe extends CollectionTypeSchema {
  info: {
    singularName: 'taxonomy-tpe';
    pluralName: 'taxonomy-tpes';
    displayName: 'TaxonomyType';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    href: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    count: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    thumbnail: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    desc: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    color: EnumerationAttribute<
      ['pink', 'green', 'yellow', 'red', 'indigo', 'blue', 'purple', 'gray']
    > &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    taxonomy: EnumerationAttribute<['category', 'tag']> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    listingType: EnumerationAttribute<['stay', 'experiencies', 'car']> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::taxonomy-tpe.taxonomy-tpe',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::taxonomy-tpe.taxonomy-tpe',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::taxonomy-tpe.taxonomy-tpe',
      'oneToMany',
      'api::taxonomy-tpe.taxonomy-tpe'
    >;
    locale: StringAttribute;
  };
}

export interface ApiVirtualAccountVirtualAccount extends CollectionTypeSchema {
  info: {
    singularName: 'virtual-account';
    pluralName: 'virtual-accounts';
    displayName: 'VirtualAccount';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    accountId: StringAttribute & RequiredAttribute & UniqueAttribute;
    accountBalance: StringAttribute & RequiredAttribute & DefaultTo<'0'>;
    availableBalance: StringAttribute & RequiredAttribute & DefaultTo<'0'>;
    currency: EnumerationAttribute<['USDT', 'USDC']> &
      RequiredAttribute &
      DefaultTo<'USDT'>;
    frozen: BooleanAttribute & RequiredAttribute & DefaultTo<false>;
    active: BooleanAttribute & RequiredAttribute & DefaultTo<false>;
    customerId: StringAttribute & RequiredAttribute;
    accountNumber: StringAttribute & RequiredAttribute;
    accountCode: StringAttribute;
    accountingCurrency: StringAttribute & RequiredAttribute;
    xpub: StringAttribute;
    user: RelationAttribute<
      'api::virtual-account.virtual-account',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    payments: RelationAttribute<
      'api::virtual-account.virtual-account',
      'oneToMany',
      'api::payment.payment'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::virtual-account.virtual-account',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::virtual-account.virtual-account',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface UtilsAvailableDate extends ComponentSchema {
  info: {
    displayName: 'DateComponent';
    description: '';
  };
  attributes: {
    timestamp: TextAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::amenity.amenity': ApiAmenityAmenity;
      'api::book.book': ApiBookBook;
      'api::country.country': ApiCountryCountry;
      'api::payment.payment': ApiPaymentPayment;
      'api::stay.stay': ApiStayStay;
      'api::taxonomy-tpe.taxonomy-tpe': ApiTaxonomyTpeTaxonomyTpe;
      'api::virtual-account.virtual-account': ApiVirtualAccountVirtualAccount;
      'utils.available-date': UtilsAvailableDate;
    }
  }
}
