"""
This module registers APIs to the main application
"""

from flask import Flask


def register(app: Flask):
    pass


def _register_job_creation_api(app: Flask):
    app.add_url_rule('/', 'api/job/create', create_job())


def create_job():
    pass