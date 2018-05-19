class DetailsController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_action :authenticate_user!

  #
  def details
    patients = Patient.all.order_by(:created_at => 'desc')

    doctors = Doctor.all.order_by(:created_at => 'desc')
    gon.doctors = doctors

    gon.patients = patients
    render json: {
        patients: patients, doctors: doctors
    }

  end

  def create_patient
    if params[:name].present? && params[:phone].present?
      @patient = Patient.new(:name => params[:name],
                             :phone => params[:phone]
      )
    end
    @patient.save(validate: false)
    render json: {}
  end

  def create_doctor
    if params[:name].present? && params[:phone].present? && params[:specialisation]
      @doctor = Doctor.new(:name => params[:name],
                           :phone => params[:phone],
                           :specialisation => params[:specialisation]
      )
    end
    @doctor.save(validate: false)

    render json: {}
  end

  def appointment_details
    if params[:patient_name].present?
       id = params[:patient_name]
      @patient = Patient.find_by({:_id =>BSON::ObjectId.from_string(id)})
      @patient.update_attributes(:disease => params[:disease]
      )
    end
    @patient.save(validate: false)
    if params[:doctor_name].present?
      id = params[:doctor_name]
      @doctor = Doctor.find_by({_id:BSON::ObjectId.from_string(id)})
      @doctor.add_patients(params[:patient_name])

    end
      @doctor.save(validate:false)
    # if params[:doctor_name].present?
    #   @doctor = Doctor.find_by({phone:params[:doctor_name]})
    #   if params[:patient_name].present? && params[:disease].present?
    #     patient = Patient.new({ :name => params[:patient_name],
    #                             :disease => params[:disease]
    #                           })
    #     @doctor.add_patients(patient)
    #   end
    #   @doctor.save(validate: false)
    # end
    render json: {}

  end

end
