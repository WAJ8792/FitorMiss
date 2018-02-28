class CreateReservations < ActiveRecord::Migration[5.0]
  def change
    create_table :reservations do |t|

      t.timestamps
    end
  end
end
