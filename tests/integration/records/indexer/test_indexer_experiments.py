# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# inspirehep is free software; you can redistribute it and/or modify it under
# the terms of the MIT License; see LICENSE file for more details.

import json
from copy import deepcopy

from invenio_search import current_search_client as es


def test_index_experiment_record(base_app, es_clear, db, datadir, create_record):
    data = json.loads((datadir / "1108541.json").read_text())
    record = create_record("exp", data=data)

    expected_count = 1
    expected_metadata = deepcopy(record)
    expected_metadata["experiment_suggest"] = {
        "input": [
            "LHC",
            "ATLAS",
            "CERN",
            "CERN-LHC-ATLAS",
            "{ATLAS}",
            "ATLAS",
            "CERN-ATLAS",
        ]
    }

    response = es.search("records-experiments")

    assert response["hits"]["total"] == expected_count
    assert response["hits"]["hits"][0]["_source"] == expected_metadata