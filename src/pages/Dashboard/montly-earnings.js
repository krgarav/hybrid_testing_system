import React from "react"
import { Card, CardBody, Row, CardTitle } from "reactstrap"
import DonutChart from '../AllCharts/DonutChart';

const MonthlyEarnings = props => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Monthly Exams</CardTitle>

                    <Row className="text-center mt-4">
                        <div className="col-6">
                            <h5 className="font-size-20">10</h5>
                            <p className="text-muted">Ofline</p>
                        </div>
                        <div className="col-6">
                            <h5 className="font-size-20">15</h5>
                            <p className="text-muted">Online</p>
                        </div>
                    </Row>
                    <div dir="ltr">
                        <DonutChart />
                    </div>

                </CardBody>
            </Card>
        </React.Fragment>
    )

}

export default MonthlyEarnings
