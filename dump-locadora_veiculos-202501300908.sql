PGDMP     /        	             }            locadora_veiculos "   14.15 (Ubuntu 14.15-1.pgdg22.04+1) "   14.15 (Ubuntu 14.15-1.pgdg22.04+1) %    ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            @           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            A           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            B           1262    16457    locadora_veiculos    DATABASE     f   CREATE DATABASE locadora_veiculos WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'pt_BR.UTF-8';
 !   DROP DATABASE locadora_veiculos;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            C           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    16491 
   categorias    TABLE     j   CREATE TABLE public.categorias (
    id integer NOT NULL,
    descricao character varying(20) NOT NULL
);
    DROP TABLE public.categorias;
       public         heap    postgres    false    3            �            1259    16490    categorias_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categorias_id_seq;
       public          postgres    false    212    3            D           0    0    categorias_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;
          public          postgres    false    211            �            1259    16459    marcas    TABLE     a   CREATE TABLE public.marcas (
    id integer NOT NULL,
    nome character varying(20) NOT NULL
);
    DROP TABLE public.marcas;
       public         heap    postgres    false    3            �            1259    16458    marcas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.marcas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.marcas_id_seq;
       public          postgres    false    210    3            E           0    0    marcas_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.marcas_id_seq OWNED BY public.marcas.id;
          public          postgres    false    209            �            1259    16562 	   userlogin    TABLE       CREATE TABLE public.userlogin (
    id integer NOT NULL,
    email character varying(200) NOT NULL,
    password_hash character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    role character varying(50) DEFAULT 'user'::character varying NOT NULL
);
    DROP TABLE public.userlogin;
       public         heap    postgres    false    3            �            1259    16561    userlogin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.userlogin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.userlogin_id_seq;
       public          postgres    false    216    3            F           0    0    userlogin_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.userlogin_id_seq OWNED BY public.userlogin.id;
          public          postgres    false    215            �            1259    16498    veiculos    TABLE       CREATE TABLE public.veiculos (
    id integer NOT NULL,
    modelo character varying(25) NOT NULL,
    ano integer NOT NULL,
    preco_diario numeric(10,2) NOT NULL,
    id_marca integer NOT NULL,
    id_categoria integer NOT NULL,
    disponivel boolean
);
    DROP TABLE public.veiculos;
       public         heap    postgres    false    3            �            1259    16497    veiculos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.veiculos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.veiculos_id_seq;
       public          postgres    false    3    214            G           0    0    veiculos_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.veiculos_id_seq OWNED BY public.veiculos.id;
          public          postgres    false    213            �           2604    16494    categorias id    DEFAULT     n   ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);
 <   ALTER TABLE public.categorias ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211    212            �           2604    16462 	   marcas id    DEFAULT     f   ALTER TABLE ONLY public.marcas ALTER COLUMN id SET DEFAULT nextval('public.marcas_id_seq'::regclass);
 8   ALTER TABLE public.marcas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            �           2604    16565    userlogin id    DEFAULT     l   ALTER TABLE ONLY public.userlogin ALTER COLUMN id SET DEFAULT nextval('public.userlogin_id_seq'::regclass);
 ;   ALTER TABLE public.userlogin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    16501    veiculos id    DEFAULT     j   ALTER TABLE ONLY public.veiculos ALTER COLUMN id SET DEFAULT nextval('public.veiculos_id_seq'::regclass);
 :   ALTER TABLE public.veiculos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    214    214            8          0    16491 
   categorias 
   TABLE DATA           3   COPY public.categorias (id, descricao) FROM stdin;
    public          postgres    false    212   �'       6          0    16459    marcas 
   TABLE DATA           *   COPY public.marcas (id, nome) FROM stdin;
    public          postgres    false    210   �'       <          0    16562 	   userlogin 
   TABLE DATA           O   COPY public.userlogin (id, email, password_hash, created_at, role) FROM stdin;
    public          postgres    false    216   ((       :          0    16498    veiculos 
   TABLE DATA           e   COPY public.veiculos (id, modelo, ano, preco_diario, id_marca, id_categoria, disponivel) FROM stdin;
    public          postgres    false    214   @)       H           0    0    categorias_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.categorias_id_seq', 19, true);
          public          postgres    false    211            I           0    0    marcas_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.marcas_id_seq', 17, true);
          public          postgres    false    209            J           0    0    userlogin_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.userlogin_id_seq', 34, true);
          public          postgres    false    215            K           0    0    veiculos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.veiculos_id_seq', 28, true);
          public          postgres    false    213            �           2606    16496    categorias categorias_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categorias DROP CONSTRAINT categorias_pkey;
       public            postgres    false    212            �           2606    16464    marcas marcas_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.marcas DROP CONSTRAINT marcas_pkey;
       public            postgres    false    210            �           2606    16570    userlogin userlogin_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.userlogin
    ADD CONSTRAINT userlogin_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.userlogin DROP CONSTRAINT userlogin_email_key;
       public            postgres    false    216            �           2606    16568    userlogin userlogin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.userlogin
    ADD CONSTRAINT userlogin_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.userlogin DROP CONSTRAINT userlogin_pkey;
       public            postgres    false    216            �           2606    16503    veiculos veiculos_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.veiculos DROP CONSTRAINT veiculos_pkey;
       public            postgres    false    214            �           2606    16509 #   veiculos veiculos_id_categoria_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id);
 M   ALTER TABLE ONLY public.veiculos DROP CONSTRAINT veiculos_id_categoria_fkey;
       public          postgres    false    212    3233    214            �           2606    16504    veiculos veiculos_id_marca_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.veiculos
    ADD CONSTRAINT veiculos_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marcas(id);
 I   ALTER TABLE ONLY public.veiculos DROP CONSTRAINT veiculos_id_marca_fkey;
       public          postgres    false    3231    214    210            8   '   x�3��2��H,I�HJL��2�NMI������ ���      6   9   x�3����KI�2����..OLO��2��JM-�2�t�/J�2�ɯ�/I����� f��      <     x�e�Kr�0  �5���Ɛ1����hь+:�"���g����k��a�5纑��e�.���6Brd��s!��r��K�y�Y����<+Q�)s#ڥ���f��ׯų���]�����1F�ɠe"�Q������1�_���H�mSGu���.�I�N��s�� �?���gd�'���N��ִ ��b�ߖܷx��c|q[���%��.��+6�`��{�W	�YE���ű/T~�Wo�1�(Sf�ФJ�L���	�m      :   n   x�32�N,K�,��4202�4�0�30�4�4�,����,+-� L�2i\F����9P-0	c�sN������D9C ,�2��1��44@�c���	���T� �u      