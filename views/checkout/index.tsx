// app/components/OrderFormSimple.tsx
"use client";

import { Banner } from '@/components/Banner';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Banknote, Landmark, FileText, Clock, X, CheckCircle } from 'lucide-react';
import useCarritoStore from '@/store/useCarritoStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface FormData {
  ci: string;
  name: string;
  lastname: string;
  phone: string;
  ciudad: string;
  id: string;
  numbers: number;
  recive: File | null | string;
  email: string;
  provincia: string;
}

interface Provincia {
  id: string;
  name: string;
  ciudades: Ciudad[];
}

interface Ciudad {
  id: string;
  name: string;
  id_provincia: string;
}

export default function ChekcOutView() {
  const { carrito } = useCarritoStore();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(true);
  const [errorProvincias, setErrorProvincias] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ci: '',
    name: '',
    lastname: '',
    phone: '',
    ciudad: '',
    id: carrito?.id || '',
    numbers: carrito?.numbers || 0,
    recive: null,
    email: '',
    provincia: ''
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para el contador del modal
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showSuccessModal && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showSuccessModal && countdown === 0) {
      handleCloseModal();
    }

    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown]);

  // Efecto para cargar provincias
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get('https://rifas.soelecsa.com/api/getCountry');
        setProvincias(response.data);
        setLoadingProvincias(false);
      } catch (err) {
        setErrorProvincias('Error al cargar las provincias');
        setLoadingProvincias(false);
        console.error('Error fetching provinces:', err);
      }
    };

    fetchProvincias();
  }, []);

  // Manejar cambio de provincia
  const handleProvinciaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = e.target.value;
    setFormData(prev => ({
      ...prev,
      provincia: provinciaId,
      ciudad: '' // Resetear ciudad cuando cambia la provincia
    }));

    // Encontrar la provincia seleccionada y cargar sus ciudades
    const provinciaSeleccionada = provincias.find(p => p.id === provinciaId);
    if (provinciaSeleccionada) {
      setCiudades(provinciaSeleccionada.ciudades);
    } else {
      setCiudades([]);
    }
  };

  // Manejar cambio de ciudad
  const handleCiudadChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const ciudadId = e.target.value;
    setFormData(prev => ({
      ...prev,
      ciudad: ciudadId
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        recive: file
      }));
      setFilePreview(URL.createObjectURL(file));
      // Clear file error if exists
      if (formErrors.recive) {
        setFormErrors(prev => ({ ...prev, recive: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        recive: null
      }));
      setFilePreview(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Nombre es requerido';
      isValid = false;
    }
    if (!formData.lastname.trim()) {
      errors.lastname = 'Apellido es requerido';
      isValid = false;
    }
    if (!formData.ci.trim()) {
      errors.ci = 'Cédula o pasaporte es requerido';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email es requerido';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email no es válido';
      isValid = false;
    }
    if (!formData.recive) {
      errors.recive = 'Comprobante de pago es requerido';
      isValid = false;
    }

    if (!formData.provincia) {
      errors.provincia = 'Provincia es requerida';
      isValid = false;
    }
    if (!formData.ciudad) {
      errors.ciudad = 'Ciudad es requerida';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push('/'); // Redirige a la página de inicio
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(formErrors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('ci', formData.ci);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('lastname', formData.lastname);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('ciudad', formData.ciudad);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('id', formData.id);
      formDataToSend.append('numbers', formData.numbers.toString());
      if (formData.recive) {
        formDataToSend.append('recive', formData.recive as File);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      };

      const response = await axios.post(
        'https://rifas.soelecsa.com/api/takeNumber',
        formDataToSend,
        config
      );

      console.log(235, response.data);

      if (response.data.status === 200) {
        setShowSuccessModal(true); // Mostrar modal de éxito
      } else {
        throw new Error(response.data.message || 'Error en el servidor');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      let errorMessage = 'Ocurrió un error al procesar el pago';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto my-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Formulario de Pedido</h2>

        {/* Modal de éxito */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black-50 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Pedido exitoso!</h3>
                <p className="mb-4">Tu pedido ha sido procesado correctamente.</p>
                <p className="text-sm text-gray-500">
                  Redirigiendo a la página de inicio en {countdown} segundos...
                </p>
                <button
                  onClick={handleCloseModal}
                  className="mt-4 px-4 py-2 bg-[#b91419] text-white rounded-md hover:bg-black"
                >
                  Cerrar ahora
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Formulario */}
          <div className="w-full md:w-3/5 px-6 sm:p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Nombre *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su nombre"
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Apellido *
                </label>
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su apellido"
                  required
                />
                {formErrors.lastname && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastname}</p>
                )}
              </div>

              {/* Cédula o Pasaporte */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Cédula o Pasaporte *
                </label>
                <input
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su número de identificación"
                  required
                />
                {formErrors.ci && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.ci}</p>
                )}
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Provincia *
                </label>
                <select
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleProvinciaChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una provincia</option>
                  {loadingProvincias ? (
                    <option>Cargando provincias...</option>
                  ) : errorProvincias ? (
                    <option>{errorProvincias}</option>
                  ) : (
                    provincias.map((provincia) => (
                      <option key={provincia.id} value={provincia.id}>
                        {provincia.name}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.provincia && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.provincia}</p>
                )}
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Ciudad *
                </label>
                <select
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleCiudadChange}
                  disabled={!formData.provincia || ciudades.length === 0}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.name}
                    </option>
                  ))}
                </select>
                {formErrors.ciudad && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.ciudad}</p>
                )}
              </div>

              {/* Correo Electrónico*/}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Correo Electrónico *
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su correo electrónico"
                  type="email"
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su número de teléfono"
                  type="tel"
                />
              </div>

              {/* Comprobante de Pago */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Comprobante de Pago *
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black px-4 py-2 text-white rounded-md hover:bg-[#b91419] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    Seleccionar archivo
                  </button>
                  <span className="ml-2 text-sm text-gray-500">
                    {filePreview ? 'Archivo seleccionado' : 'Ningún archivo seleccionado'}
                  </span>
                </div>
                {formErrors.recive?.toString() && (
                  <p className="mt-1 text-sm text-red-500">subir un comprobante</p>
                )}
                {filePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Vista previa:</p>
                    {filePreview.includes('image') ? (
                      <img src={filePreview} alt="Preview" className="mt-1 h-20 object-cover" />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-100 rounded">
                        <p className="text-sm">Documento seleccionado</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón de envío */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-4 text-white rounded-md focus:outline-none ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#b91419] hover:bg-black cursor-pointer'
                    }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Realizar el Pedido'}
                </button>
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="w-full md:w-3/5 p-6">
            <h3 className="text-xl font-semibold mb-4">Tu Pedido</h3>

            <div>
              <div className="flex text-white justify-between p-4 bg-[#d5af03]">
                <span className='font-bold'>Producto</span>
                <span className='font-bold'>Subtotal</span>
              </div>

              <div className="flex justify-between p-4">
                <span>{carrito?.name} * {carrito?.numbers}</span>
                <span>${carrito?.price}</span>
              </div>
            </div>

            <div className="flex justify-between p-4 text-lg font-bold border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${carrito?.price}</span>
            </div>

            <div className="mt-6 p-8 bg-[#d5af03] rounded-lg">
              <h4 className="text-xl text-white font-bold mb-4">Transferencia bancaria directa</h4>
              <div className="space-y-3 text-sm text-white">
                <div className='flex items-center gap-2'>
                  <img src="https://proyectosflores.com/wp-content/uploads/2025/01/logo_bp.png" alt="Banco" className="w-full max-w-40 h-4 mb-2" />
                  <p className="flex items-start gap-2">
                    <span>
                      Número: 221391347<br />
                      CI: 0963333752<br />
                      Nombre: Maribeth Rodríguez.
                    </span>
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <img src="https://proyectosflores.com/wp-content/uploads/2025/01/logo_bg.png" alt="Banco" className="w-full max-w-40 h-10 mt-6 mb-2" />
                  <p className="flex items-start gap-2">
                    <span>
                      Tipo de cuenta: Cuenta Ahorros<br />
                      Número: 48326213<br />
                      CI: 0927391995<br />
                      Nombre: Miguel Moreira
                    </span>
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <img src="https://proyectosflores.com/wp-content/uploads/2025/01/logo-deuna.png" alt="Banco" className="w-full max-w-40 h-10 mt-6 mb-2" />
                  <img src="https://proyectosflores.com/wp-content/uploads/2025/01/qr_deuna.jpg" alt="Banco" className="w-full max-w-40 h-full max-h-40 mt-6 mb-2" />
                </div>

                <p className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                  Envíanos el COMPROBANTE DE PAGO Y NÚMERO DE PEDIDO (esquina superior izquierda de esta pantalla) por WhatsApp al <a className='cursor-pointer text-blue-500' href="https://wa.me/593995501485">+593995501485</a> dando click aquí O NO SE GENERARÁN TUS NÚMEROS.
                  </span>
                </p>

                <p className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.
                  </span>
                </p>

                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Los pagos pueden tardar hasta 24 horas en ser verificados en días hábiles.
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>
                Sus datos personales se utilizarán para procesar su pedido, respaldar su experiencia en este sitio web y para otros fines descritos en nuestra política de privacidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}