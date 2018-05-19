class Doctor
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :phone, type: String
  field :specialisation, type: String
  field :patients, type: Array

  def add_patients(patient)
    self.patients ||= []
    self.patients << patient
  end

end