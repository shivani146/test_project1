class Patient
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :phone, type: String
  field :disease, type: String


end